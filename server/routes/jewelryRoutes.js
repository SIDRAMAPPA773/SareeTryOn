const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const upload = require('../middleware/uploadMiddleware'); // reuse Saree multer middleware
const { requireAuth } = require('../middleware/authMiddleware');
const {
  getProfile,
  getCredits,
  getCreditHistory,
  listUserModels,
  deleteUserModel,
  generate3D,
  getJobStatus,
  getPlans,
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
  downloadModel
} = require('../controllers/jewelryController');

// Public download endpoint for generated GLB files.
// Keeps compatibility with both /api/models/:id/download and /api/jewelry/api/models/:id/download.
router.get('/api/models/:model_id/download', downloadModel);

// All user-facing jewelry routes require Firebase authentication
router.use(requireAuth);

// @route   GET /api/jewelry/user/profile
router.get('/user/profile', getProfile);

// @route   GET /api/jewelry/user/credits
router.get('/user/credits', getCredits);

// @route   GET /api/jewelry/user/credits/history
router.get('/user/credits/history', getCreditHistory);

// @route   GET /api/jewelry/user/models
router.get('/user/models', listUserModels);

// @route   DELETE /api/jewelry/user/models/:model_id
router.delete('/user/models/:model_id', deleteUserModel);

// @route   POST /api/jewelry/image-to-3d/generate
// @desc    Generate 3D model from image
router.post('/image-to-3d/generate', upload.single('file'), generate3D);

// @route   GET /api/jewelry/jobs/:job_id
router.get('/jobs/:job_id', getJobStatus);

// @route   GET /api/jewelry/plans
// @desc    Get plans (this endpoint requires auth here, though we can make it public if needed)
router.get('/plans', getPlans);

// @route   POST /api/jewelry/payments/create-order
router.post('/payments/create-order', createPaymentOrder);

// @route   POST /api/jewelry/payments/verify
router.post('/payments/verify', verifyPayment);

// @route   GET /api/jewelry/payments/history
router.get('/payments/history', getPaymentHistory);

module.exports = router;
