const fs = require('fs');
const path = require('path');
const AdminUser = require('../models/AdminUser');
const Model3D = require('../models/Model3D');
const GenerationJob = require('../models/GenerationJob');
const Plan = require('../models/Plan');
const Payment = require('../models/Payment');
const CreditTransaction = require('../models/CreditTransaction');
const SystemSetting = require('../models/SystemSetting');
const StorageAuditLog = require('../models/StorageAuditLog');
const AdminActivityLog = require('../models/AdminActivityLog');


/**
 * Log admin activity helper
 */
const logAdminActivity = async (adminId, action, targetType, targetId, details, ip) => {
  try {
    await AdminActivityLog.create({
      admin_user_id: adminId,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      ip_address: ip || ''
    });
  } catch (err) {
    console.error('Failed to log admin activity:', err.message);
  }
};

/**
 * @desc    Get Admin Dashboard Stats
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await AdminUser.countDocuments();
    const totalGenerations = await GenerationJob.countDocuments();
    const totalModels = await Model3D.countDocuments({ status: 'active' });
    
    // Revenue calculation (captured payments)
    const capturedPayments = await Payment.find({ status: 'captured' });
    const totalRevenuePaise = capturedPayments.reduce((sum, p) => sum + (p.amount_paise || 0), 0);
    
    const recentModels = await Model3D.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPayments = await Payment.find({ status: 'captured' })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        total_users: totalUsers,
        total_generations: totalGenerations,
        total_models: totalModels,
        total_revenue_inr: totalRevenuePaise / 100
      },
      recent_models: recentModels,
      recent_payments: recentPayments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List Users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const listUsers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '50');
    const offset = parseInt(req.query.offset || '0');
    
    // User model removed, return empty
    res.status(200).json({
      users: [],
      total: 0
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update User (suspend/credits/plan)
 * @route   PATCH /api/admin/users/:user_id
 * @access  Private/Admin
 */
const updateUser = async (req, res, next) => {
  try {
    return res.status(404).json({ success: false, message: 'User logic disabled' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List Generations
 * @route   GET /api/admin/generations
 * @access  Private/Admin
 */
const listGenerations = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '50');
    const offset = parseInt(req.query.offset || '0');
    const status = req.query.status || '';

    const query = {};
    if (status) query.status = status;

    const total = await GenerationJob.countDocuments(query);
    const jobs = await GenerationJob.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.status(200).json({
      jobs,
      total
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List Models
 * @route   GET /api/admin/models
 * @access  Private/Admin
 */
const listModels = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '50');
    const offset = parseInt(req.query.offset || '0');
    const status = req.query.status || '';

    const query = {};
    if (status) query.status = status;

    const total = await Model3D.countDocuments(query);
    const models = await Model3D.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.status(200).json({
      models,
      total
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List Payments
 * @route   GET /api/admin/payments
 * @access  Private/Admin
 */
const listPayments = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '50');
    const offset = parseInt(req.query.offset || '0');
    const status = req.query.status || '';

    const query = {};
    if (status) query.status = status;

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.status(200).json({
      payments,
      total
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get System Settings
 * @route   GET /api/admin/settings
 * @access  Private/Admin
 */
const getSettings = async (req, res, next) => {
  try {
    const settings = await SystemSetting.find();
    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update System Setting
 * @route   PUT /api/admin/settings/:key
 * @access  Private/Admin
 */
const updateSetting = async (req, res, next) => {
  try {
    const { value } = req.body;
    const { key } = req.params;

    if (value === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide value' });
    }

    let setting = await SystemSetting.findOne({ key });
    if (!setting) {
      setting = new SystemSetting({ key, value, updated_by: req.admin.username });
    } else {
      setting.value = value;
      setting.updated_by = req.admin.username;
    }

    await setting.save();

    await logAdminActivity(
      req.admin.id,
      'UPDATE_SETTING',
      'SystemSetting',
      key,
      { value },
      req.ip
    );

    res.status(200).json({ success: true, setting });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List/Create/Update Plans (CRUD)
 * @route   GET/POST/PUT/DELETE /api/admin/plans
 * @access  Private/Admin
 */
const getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find().sort({ sort_order: 1 });
    res.status(200).json(plans);
  } catch (error) {
    next(error);
  }
};

const createPlan = async (req, res, next) => {
  try {
    const { id, name, description, price_inr, credits, features, download_glb, sort_order } = req.body;
    
    if (!id || !name) {
      return res.status(400).json({ success: false, message: 'ID and Name are required' });
    }

    const plan = await Plan.create({
      id,
      name,
      description,
      price_inr,
      credits,
      features,
      download_glb,
      sort_order
    });

    await logAdminActivity(req.admin.id, 'CREATE_PLAN', 'Plan', plan.id, plan, req.ip);

    res.status(201).json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

const updatePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findOne({ id: req.params.plan_id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const fields = ['name', 'description', 'price_inr', 'credits', 'features', 'download_glb', 'is_active', 'sort_order'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) plan[f] = req.body[f];
    });

    await plan.save();

    await logAdminActivity(req.admin.id, 'UPDATE_PLAN', 'Plan', plan.id, plan, req.ip);

    res.status(200).json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

const deletePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findOne({ id: req.params.plan_id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    await Plan.deleteOne({ id: req.params.plan_id });

    await logAdminActivity(req.admin.id, 'DELETE_PLAN', 'Plan', req.params.plan_id, {}, req.ip);

    res.status(200).json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Storage (which models are missing GLB on disk)
 * @route   POST /api/admin/storage/verify
 * @access  Private/Admin
 */
const verifyStorage = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '100');
    const activeModels = await Model3D.find({ status: 'active' }).limit(limit);

    const missing = [];
    for (const m of activeModels) {
      if (!m.storage_path || !fs.existsSync(m.storage_path)) {
        missing.push({
          id: m._id,
          name: m.name,
          embed_code: m.embed_code,
          storage_path: m.storage_path
        });
      }
    }

    res.status(200).json({
      success: true,
      total_checked: activeModels.length,
      missing_count: missing.length,
      missing_models: missing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Repair Storage (mark deleted any model missing from disk)
 * @route   POST /api/admin/storage/repair
 * @access  Private/Admin
 */
const repairStorage = async (req, res, next) => {
  try {
    const activeModels = await Model3D.find({ status: 'active' });

    let repairedCount = 0;
    for (const m of activeModels) {
      if (!m.storage_path || !fs.existsSync(m.storage_path)) {
        m.status = 'deleted';
        await m.save();

        await StorageAuditLog.create({
          model_id: m._id,
          action: 'REPAIR_DELETE',
          result: 'success',
          details: { reason: 'Missing file on disk' }
        });

        repairedCount++;
      }
    }

    await logAdminActivity(req.admin.id, 'REPAIR_STORAGE', 'Storage', 'all', { repaired_count: repairedCount }, req.ip);

    res.status(200).json({
      success: true,
      repaired_count: repairedCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Admin Activity Logs
 * @route   GET /api/admin/activity-logs
 * @access  Private/Admin
 */
const getActivityLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '100');
    const logs = await AdminActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  listUsers,
  updateUser,
  listGenerations,
  listModels,
  listPayments,
  getSettings,
  updateSetting,
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  verifyStorage,
  repairStorage,
  getActivityLogs
};
