const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Razorpay = require('razorpay');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const Model3D = require('../models/Model3D');
const GenerationJob = require('../models/GenerationJob');
const Plan = require('../models/Plan');
const Payment = require('../models/Payment');
const CreditTransaction = require('../models/CreditTransaction');
const SystemSetting = require('../models/SystemSetting');
const StorageAuditLog = require('../models/StorageAuditLog');

const { preprocessImage } = require('../services/preprocessService');
const { submitToMeshy, pollTaskStatus, downloadGlbFile } = require('../services/meshyService');

const CREDITS_PER_GENERATION = 30;
const UNIQUE_CODE_PREFIX = 'PIX-';

// Initialize Razorpay
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

/**
 * Helper to generate a unique 8-character embed code
 */
const generateUniqueCode = () => {
  return UNIQUE_CODE_PREFIX + crypto.randomBytes(4).toString('hex').toUpperCase();
};

/**
 * Helper to get a platform setting
 */
const getSetting = async (key, defaultValue) => {
  try {
    const setting = await SystemSetting.findOne({ key });
    return setting ? setting.value : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

/**
 * @desc    Get Current User Profile
 * @route   GET /api/user/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const credits = user.credits || 0;
    
    let planName = 'free';
    if (user.plan_id) {
      const plan = await Plan.findOne({ id: user.plan_id });
      if (plan) planName = plan.name.toLowerCase();
    }

    res.status(200).json({
      id: user._id,
      firebase_uid: user.firebase_uid,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      role: user.role,
      plan: planName,
      plan_id: user.plan_id,
      credits,
      credits_used: user.credits_used_total || 0,
      models_remaining: Math.floor(credits / CREDITS_PER_GENERATION),
      is_unlimited: false,
      is_admin: user.is_admin,
      is_super_admin: user.role === 'SUPER_ADMIN',
      admin_role: user.is_admin ? user.role : null,
      status: user.status,
      permissions: user.is_admin ? ['admin:read', 'admin:write'] : []
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get User Credits
 * @route   GET /api/user/credits
 * @access  Private
 */
const getCredits = async (req, res, next) => {
  try {
    const user = req.user;
    const credits = user.credits || 0;

    res.status(200).json({
      credits,
      models_remaining: Math.floor(credits / CREDITS_PER_GENERATION),
      credits_used: user.credits_used_total || 0,
      is_unlimited: false
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Credit History
 * @route   GET /api/user/credits/history
 * @access  Private
 */
const getCreditHistory = async (req, res, next) => {
  try {
    const user = req.user;
    const limit = parseInt(req.query.limit || '50');
    const offset = parseInt(req.query.offset || '0');

    const total = await CreditTransaction.countDocuments({ user_id: user.firebase_uid });
    const transactions = await CreditTransaction.find({ user_id: user.firebase_uid })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.status(200).json({
      transactions,
      total
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List User Generated 3D Models
 * @route   GET /api/user/models
 * @access  Private
 */
const listUserModels = async (req, res, next) => {
  try {
    const user = req.user;
    const models = await Model3D.find({ user_id: user.firebase_uid, status: 'active' }).sort({ createdAt: -1 });
    
    // Add full public URL for frontend if needed
    const baseUrl = process.env.PIXRITY_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const result = models.map(m => {
      const modelObj = m.toObject();
      // Ensure glb_url is absolute if it's local
      if (modelObj.glb_url && !modelObj.glb_url.startsWith('http')) {
        modelObj.glb_url = `${baseUrl}${modelObj.glb_url}`;
      }
      return modelObj;
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete User 3D Model
 * @route   DELETE /api/user/models/:model_id
 * @access  Private
 */
const deleteUserModel = async (req, res, next) => {
  try {
    const user = req.user;
    const model = await Model3D.findById(req.params.model_id);

    if (!model) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }

    if (model.user_id !== user.firebase_uid && user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // Delete local file if it exists
    if (model.storage_path && fs.existsSync(model.storage_path)) {
      try {
        fs.unlinkSync(model.storage_path);
        // Also delete parent folder if empty
        const parentDir = path.dirname(model.storage_path);
        const files = fs.readdirSync(parentDir);
        if (files.length === 0) {
          fs.rmdirSync(parentDir);
        }
      } catch (err) {
        console.warn('Error deleting local file:', err.message);
      }
    }

    // Mark deleted in DB
    model.status = 'deleted';
    await model.save();

    // Log storage audit
    await StorageAuditLog.create({
      model_id: model._id,
      action: 'DELETE',
      result: 'success',
      details: { deleted_by: user.firebase_uid }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate 3D Model from Image
 * @route   POST /api/image-to-3d/generate
 * @access  Private
 */
const generate3D = async (req, res, next) => {
  try {
    const user = req.user;
    const credits = user.credits || 0;

    if (credits < CREDITS_PER_GENERATION) {
      return res.status(402).json({
        success: false,
        code: 'INSUFFICIENT_CREDITS',
        message: `You need ${CREDITS_PER_GENERATION} credits to generate a model. You have ${credits}.`,
        credits
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      // Clean up uploaded file
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Only JPEG, PNG, and WEBP images are accepted' });
    }

    const meshyApiKey = process.env.MESHY_API_KEY;
    const isMockMode = !meshyApiKey || meshyApiKey === 'your_meshy_api_key_here';
    if (isMockMode) {
      console.warn('MESHY_API_KEY not found. Running in MOCK MODE for 3D Generation.');
    }

    const jobId = crypto.randomUUID();
    const uniqueCode = generateUniqueCode();
    const originalFilename = req.file.originalname;
    const fileExt = path.extname(originalFilename);

    // Save uploaded file permanently under outputs/jobId/input.ext
    const outputsDir = path.join(__dirname, '../outputs', jobId);
    if (!fs.existsSync(outputsDir)) {
      fs.mkdirSync(outputsDir, { recursive: true });
    }

    const permanentInputPath = path.join(outputsDir, `input${fileExt}`);
    fs.renameSync(req.file.path, permanentInputPath);

    const baseUrl = process.env.PIXRITY_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/outputs/${jobId}/input${fileExt}`;

    // Create GenerationJob record
    const job = await GenerationJob.create({
      id: jobId,
      user_id: user.firebase_uid,
      input_image_url: imageUrl,
      status: 'pending',
      progress: 0,
      credits_consumed: CREDITS_PER_GENERATION,
      credits_refunded: false,
      unique_code: uniqueCode,
      original_filename: originalFilename,
      file_ext: fileExt
    });

    // Start background processing pipeline
    runBackgroundPipeline(jobId, permanentInputPath, user.firebase_uid, uniqueCode, originalFilename, imageUrl, meshyApiKey, isMockMode);

    res.status(200).json({
      job_id: jobId,
      unique_code: uniqueCode,
      status: 'pending',
      credits_remaining: credits // not yet deducted until submission succeeds
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * Background pipeline runner
 */
async function runBackgroundPipeline(jobId, inputPath, userId, uniqueCode, originalFn, imageUrl, meshyApiKey, isMockMode) {
  const updateJob = async (data) => {
    await GenerationJob.updateOne({ id: jobId }, data);
  };

  let creditsDeducted = false;

  try {
    await updateJob({ status: 'processing', progress: 10 });

    // 1. Image Preprocessing (Background removal + Enhancements)
    let preprocessedDataUri;
    try {
      console.log(`[Background Job ${jobId}] Starting Python image preprocessing...`);
      preprocessedDataUri = await preprocessImage(inputPath, true);
      await updateJob({ progress: 30 });
    } catch (preprocessError) {
      console.warn(`[Background Job ${jobId}] Preprocessing failed, trying without background removal:`, preprocessError.message);
      // Fallback to preprocessing without background removal
      preprocessedDataUri = await preprocessImage(inputPath, false);
      await updateJob({ progress: 30 });
    }

    let meshyTaskId;
    let glbOutputPath;

    if (isMockMode) {
      console.log(`[Background Job ${jobId}] Mock Mode: Simulating API delay...`);
      // Wait for 10 seconds to simulate processing
      await new Promise(resolve => setTimeout(resolve, 10000));
      await updateJob({ progress: 60 });
      await new Promise(resolve => setTimeout(resolve, 10000));
      await updateJob({ progress: 88 });
      
      const outputsDir = path.dirname(inputPath);
      glbOutputPath = path.join(outputsDir, 'model.glb');
      
      // Copy dummy model to output path
      const dummyPath = path.join(__dirname, '../assets/dummy_model.glb');
      if (fs.existsSync(dummyPath)) {
        fs.copyFileSync(dummyPath, glbOutputPath);
      } else {
        throw new Error('Dummy model not found for Mock Mode.');
      }
      await updateJob({ progress: 95 });
    } else {
      // 2. Submit to Meshy
      console.log(`[Background Job ${jobId}] Submitting to Meshy...`);
      meshyTaskId = await submitToMeshy(preprocessedDataUri, meshyApiKey);
      await updateJob({ meshy_task_id: meshyTaskId, progress: 35 });
    }

    // 3. Deduct credits upon successful Meshy submission
    const user = await User.findOne({ firebase_uid: userId });
    if (user) {
      const beforeBalance = user.credits || 0;
      const afterBalance = Math.max(0, beforeBalance - CREDITS_PER_GENERATION);
      user.credits = afterBalance;
      user.credits_used_total = (user.credits_used_total || 0) + CREDITS_PER_GENERATION;
      await user.save();

      await CreditTransaction.create({
        user_id: userId,
        change_amount: -CREDITS_PER_GENERATION,
        before_balance: beforeBalance,
        after_balance: afterBalance,
        reason: 'GENERATION',
        reference_id: jobId,
        description: `3D generation: ${originalFn}`
      });
      creditsDeducted = true;
      console.log(`[Background Job ${jobId}] Deducted ${CREDITS_PER_GENERATION} credits. New balance: ${afterBalance}`);
    }

    if (!isMockMode) {
      // 4. Poll Meshy task status
      console.log(`[Background Job ${jobId}] Polling Meshy task: ${meshyTaskId}...`);
      const taskResult = await pollTaskStatus(meshyTaskId, meshyApiKey);
      await updateJob({ progress: 88 });

      // 5. Download GLB file
      const outputsDir = path.dirname(inputPath);
      glbOutputPath = path.join(outputsDir, 'model.glb');
      await downloadGlbFile(taskResult, glbOutputPath);
      await updateJob({ progress: 95 });
    }

    const baseUrl = process.env.PIXRITY_BASE_URL || '';
    const glbUrl = `/outputs/${jobId}/model.glb`;

    // 6. Create Model3D record
    const model = await Model3D.create({
      user_id: userId,
      job_id: jobId,
      name: path.basename(originalFn, path.extname(originalFn)),
      thumbnail_url: imageUrl, // use input image as thumbnail for now
      glb_url: glbUrl,
      storage_path: glbOutputPath,
      file_size_bytes: fs.existsSync(glbOutputPath) ? fs.statSync(glbOutputPath).size : 0,
      embed_code: uniqueCode
    });

    await updateJob({
      status: 'completed',
      progress: 100,
      model_url: glbUrl
    });

    await StorageAuditLog.create({
      model_id: model._id,
      action: 'UPLOAD',
      result: 'success',
      details: { storage_path: glbOutputPath, file_size: model.file_size_bytes }
    });

    console.log(`[Background Job ${jobId}] Finished successfully. Model created: ${model._id}`);

  } catch (error) {
    console.error(`[Background Job ${jobId}] Pipeline failed:`, error.message);
    
    await updateJob({
      status: 'failed',
      error: error.message
    });

    // Refund credits if they were deducted but generation failed
    if (creditsDeducted) {
      try {
        const user = await User.findOne({ firebase_uid: userId });
        if (user) {
          const beforeBalance = user.credits || 0;
          const afterBalance = beforeBalance + CREDITS_PER_GENERATION;
          user.credits = afterBalance;
          await user.save();

          await CreditTransaction.create({
            user_id: userId,
            change_amount: CREDITS_PER_GENERATION,
            before_balance: beforeBalance,
            after_balance: afterBalance,
            reason: 'REFUND',
            reference_id: jobId,
            description: `Refund for failed 3D generation: ${originalFn}`
          });
          
          await GenerationJob.updateOne({ id: jobId }, { credits_refunded: true });
          console.log(`[Background Job ${jobId}] Refunded ${CREDITS_PER_GENERATION} credits. New balance: ${afterBalance}`);
        }
      } catch (refundErr) {
        console.error(`[Background Job ${jobId}] Failed to refund credits:`, refundErr.message);
      }
    }
  }
}

/**
 * @desc    Get Generation Job Status
 * @route   GET /api/jobs/:job_id
 * @access  Private
 */
const getJobStatus = async (req, res, next) => {
  try {
    const job = await GenerationJob.findOne({ id: req.params.job_id });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.user_id !== req.user.firebase_uid && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download GLB Model
 * @route   GET /api/models/:model_id/download
 * @access  Public (so embed code can download)
 */
const downloadModel = async (req, res, next) => {
  try {
    const modelId = req.params.model_id;

    if (!modelId || typeof modelId !== 'string') {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }

    let model = null;
    if (/^[a-fA-F0-9]{24}$/.test(modelId)) {
      model = await Model3D.findById(modelId);
    }

    if (!model) {
      model = await Model3D.findOne({ job_id: modelId });
    }

    if (!model || model.status === 'deleted') {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }

    if (!model.storage_path || !fs.existsSync(model.storage_path)) {
      return res.status(404).json({ success: false, message: 'Model file not found on disk' });
    }

    res.download(model.storage_path, `${model.embed_code}.glb`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Available Plans
 * @route   GET /api/plans
 * @access  Public
 */
const getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find({ is_active: true }).sort({ sort_order: 1 });
    res.status(200).json(plans);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create Razorpay Order
 * @route   POST /api/payments/create-order
 * @access  Private
 */
const createPaymentOrder = async (req, res, next) => {
  try {
    const { plan_id } = req.body;
    if (!plan_id) {
      return res.status(400).json({ success: false, message: 'Please provide plan_id' });
    }

    const plan = await Plan.findOne({ id: plan_id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    if (!razorpayInstance) {
      return res.status(503).json({ success: false, message: 'Razorpay is not configured on the server' });
    }

    const amount = plan.price_inr; // already in paise
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Cannot purchase a free plan' });
    }

    const orderOptions = {
      amount,
      currency: 'INR',
      receipt: `receipt_${crypto.randomBytes(6).toString('hex')}`,
      notes: {
        user_id: req.user.firebase_uid,
        plan_id: plan.id
      }
    };

    const order = await razorpayInstance.orders.create(orderOptions);

    // Create payment record in DB
    await Payment.create({
      id: order.id,
      user_id: req.user.firebase_uid,
      plan_id: plan.id,
      razorpay_order_id: order.id,
      amount_paise: amount,
      currency: 'INR',
      status: 'created',
      notes: JSON.stringify(orderOptions.notes)
    });

    res.status(201).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      plan_name: plan.name,
      credits: plan.credits
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Razorpay Payment
 * @route   POST /api/payments/verify
 * @access  Private
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification details missing' });
    }

    const payment = await Payment.findOne({ id: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Verify signature
    const hmacSecret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', hmacSecret)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;
    if (!isSignatureValid) {
      payment.status = 'failed';
      await payment.save();
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Update payment record
    payment.status = 'captured';
    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    await payment.save();

    // Allocate credits to user
    const plan = await Plan.findOne({ id: plan_id });
    const user = await User.findOne({ firebase_uid: req.user.firebase_uid });
    
    if (plan && user) {
      const beforeBalance = user.credits || 0;
      const creditsToAdd = plan.credits;
      const afterBalance = beforeBalance + creditsToAdd;

      user.credits = afterBalance;
      user.plan_id = plan.id;
      user.plan = plan.name.toLowerCase();
      await user.save();

      // Log credit transaction
      await CreditTransaction.create({
        user_id: user.firebase_uid,
        change_amount: creditsToAdd,
        before_balance: beforeBalance,
        after_balance: afterBalance,
        reason: 'PURCHASE',
        reference_id: razorpay_payment_id,
        description: `Credit Purchase: ${plan.name} Package`
      });

      res.status(200).json({
        success: true,
        credits_added: creditsToAdd,
        credits_remaining: afterBalance,
        plan: plan.name.toLowerCase()
      });
    } else {
      res.status(500).json({ success: false, message: 'Failed to allocate credits (user or plan not found)' });
    }

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get User Payment History
 * @route   GET /api/payments/history
 * @access  Private
 */
const getPaymentHistory = async (req, res, next) => {
  try {
    const user = req.user;
    const payments = await Payment.find({ user_id: user.firebase_uid, status: 'captured' }).sort({ createdAt: -1 });

    const result = payments.map(p => ({
      id: p.id,
      plan_id: p.plan_id,
      amount_paise: p.amount_paise,
      currency: p.currency,
      razorpay_order_id: p.razorpay_order_id,
      razorpay_payment_id: p.razorpay_payment_id,
      status: p.status,
      created_at: p.createdAt
    }));

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getCredits,
  getCreditHistory,
  listUserModels,
  deleteUserModel,
  generate3D,
  getJobStatus,
  downloadModel,
  getPlans,
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory
};
