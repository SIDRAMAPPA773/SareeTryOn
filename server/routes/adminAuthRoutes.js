const express = require('express');
const router = express.Router();
const { login, logout, me } = require('../controllers/adminAuthController');
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

module.exports = router;
