const { validationResult } = require('express-validator');
const TryOn = require('../models/TryOn');
const { uploadImageFile, uploadImageUrl } = require('../services/cloudinaryService');
const aiProviderFactory = require('../services/aiProviderFactory');
const fs = require('fs');

/**
 * @desc    Generate a virtual try-on image
 * @route   POST /api/tryon
 * @access  Public
 */
const createTryOn = async (req, res, next) => {
  try {
    // 1. Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map(e => e.msg).join(', ');
      return res.status(400).json({ success: false, message: errorMsg });
    }

    const { sareeImageUrl, userImageUrl } = req.body;

    let userCloudinaryUrl = userImageUrl;

    if (!userCloudinaryUrl) {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a user image' });
      }

      console.log("Received File:", req.file);
      console.log("Cloudinary Config Loaded");

    // 2. Upload user image to Cloudinary if not already provided
      console.log("Uploading Image...");
      try {
        const uploadResult = await uploadImageFile(req.file.path);
        userCloudinaryUrl = uploadResult.secure_url;
        console.log("Upload Success");
      } catch (error) {
        console.error("Cloudinary Upload Error");
        console.error(error);
        return res.status(500).json({
          success: false,
          message: error.message,
          stack: error.stack
        });
      } finally {
        // Clean up the temporary local file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    } else {
      console.log("Reusing existing Cloudinary URL for user image");
    }

    // 3. Create initial TryOn record in MongoDB
    console.log("Saving MongoDB Document (PENDING)...");
    const newTryOn = await TryOn.create({
      userImageUrl: userCloudinaryUrl,
      sareeImageUrl,
      status: 'PROCESSING'
    });

    // 4. Call AI Provider Factory
    console.log("Calling AI Provider API...");
    let finalCloudinaryUrl, modelUsed, generationTimeSeconds;
    try {
      const aiResult = await aiProviderFactory.generate(userCloudinaryUrl, sareeImageUrl);
      
      console.log("Uploading CatVTON Output to Cloudinary...");
      // Replicate returns a remote URL, we must upload it to Cloudinary so it doesn't expire
      const uploadRes = await uploadImageUrl(aiResult.generatedImageUrl);
      finalCloudinaryUrl = uploadRes.secure_url;
      
      modelUsed = aiResult.modelUsed;
      generationTimeSeconds = aiResult.generationTimeSeconds;
      console.log("CatVTON Response Success");
    } catch (error) {
      console.error("CatVTON API Error");
      console.error(error);
      newTryOn.status = 'FAILED';
      await newTryOn.save();
      return res.status(500).json({
        success: false,
        message: error.message,
        stack: error.stack
      });
    }

    // 5. Update MongoDB record
    console.log("Saving MongoDB Document (COMPLETED)...");
    newTryOn.generatedImageUrl = finalCloudinaryUrl;
    // We don't have a specific text prompt to save anymore for CatVTON, but we can log the model used.
    newTryOn.promptUsed = `Model: ${modelUsed} | Generation Time: ${generationTimeSeconds}s`;
    newTryOn.status = 'COMPLETED';
    await newTryOn.save();

    // 6. Sending final response
    console.log("Sending Final Response");
    return res.status(200).json({
      success: true,
      data: newTryOn
    });

  } catch (error) {
    console.error("Unexpected Controller Error");
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
};

/**
 * @desc    Get all try-on history
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await TryOn.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a specific try-on record
 */
const deleteHistory = async (req, res, next) => {
  try {
    const tryOn = await TryOn.findById(req.params.id);
    if (!tryOn) {
      return res.status(404).json({ success: false, message: 'Try-on record not found' });
    }

    await TryOn.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTryOn,
  getHistory,
  deleteHistory
};
