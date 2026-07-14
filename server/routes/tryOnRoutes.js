const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createTryOn, getHistory, deleteHistory } = require('../controllers/tryOnController');
const upload = require('../middleware/uploadMiddleware');

// Validation rules for try-on request
const tryOnValidation = [
  body('sareeImageUrl')
    .notEmpty().withMessage('sareeImageUrl is required')
    .isURL().withMessage('sareeImageUrl must be a valid URL')
];

// @route   POST /api/tryon
// @desc    Generate virtual try-on
router.post(
  '/',
  upload.single('userImage'),
  tryOnValidation,
  createTryOn
);

// @route   GET /api/history
// @desc    Get all try-on history
router.get('/history', getHistory);

// @route   DELETE /api/history/:id
// @desc    Delete a specific try-on record
router.delete('/history/:id', deleteHistory);

module.exports = router;
