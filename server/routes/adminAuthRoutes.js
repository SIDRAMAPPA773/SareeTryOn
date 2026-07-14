const express = require('express');
const router = express.Router();
const { login, logout, me, createAdmin } = require('../controllers/adminAuthController');
const { requireAdminAuth } = require('../middleware/adminAuthMiddleware');

// @route   POST /admin/auth/login
// @desc    Admin login
router.post('/login', login);

// @route   POST /admin/auth/logout
// @desc    Admin logout
router.post('/logout', requireAdminAuth, logout);

// @route   GET /admin/auth/me
// @desc    Get current admin profile
router.get('/me', requireAdminAuth, me);

// @route   POST /admin/auth/create
// @desc    Create new admin (Super Admin only, or public if no admins exist)
router.post('/create', createAdmin);

module.exports = router;
