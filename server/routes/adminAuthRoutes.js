const express = require('express');
const router = express.Router();
const { login, logout, me, forgotPassword, resetPassword } = require('../controllers/adminAuthController');
const { requireAuth } = require('../middleware/adminAuthMiddleware');

// @route   POST /api/auth/login
// @desc    Admin login
router.post('/login', login);

// @route   POST /api/auth/logout
// @desc    Admin logout
router.post('/logout', requireAuth, logout);

// @route   GET /api/auth/me
// @desc    Get current admin profile
router.get('/me', requireAuth, me);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password
router.post('/reset-password', resetPassword);

module.exports = router;
