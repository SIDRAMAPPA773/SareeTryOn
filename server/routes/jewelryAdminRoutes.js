const express = require('express');
const router = express.Router();
const { requireAdminAuth, requireSuperAdminAuth } = require('../middleware/adminAuthMiddleware');
const {
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
} = require('../controllers/jewelryAdminController');

// All admin routes require local admin JWT authentication
router.use(requireAdminAuth);

// @route   GET /api/admin/jewelry/dashboard
router.get('/dashboard', getDashboardStats);

// @route   GET /api/admin/jewelry/users
router.get('/users', listUsers);

// @route   PATCH /api/admin/jewelry/users/:user_id
router.patch('/users/:user_id', updateUser);

// @route   GET /api/admin/jewelry/generations
router.get('/generations', listGenerations);

// @route   GET /api/admin/jewelry/models
router.get('/models', listModels);

// @route   GET /api/admin/jewelry/payments
router.get('/payments', listPayments);

// @route   GET /api/admin/jewelry/settings
router.get('/settings', getSettings);

// @route   PUT /api/admin/jewelry/settings/:key
router.put('/settings/:key', updateSetting);

// Plans CRUD (Super Admin only for modifying)
router.get('/plans', getPlans);
router.post('/plans', requireSuperAdminAuth, createPlan);
router.put('/plans/:plan_id', requireSuperAdminAuth, updatePlan);
router.delete('/plans/:plan_id', requireSuperAdminAuth, deletePlan);

// Storage Audits
router.post('/storage/verify', verifyStorage);
router.post('/storage/repair', repairStorage);

// Activity Logs
router.get('/activity-logs', getActivityLogs);

module.exports = router;
