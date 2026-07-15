const express = require('express');
const router = express.Router();
const { requireSuperAdmin } = require('../middleware/adminAuthMiddleware');
const {
  createAdmin,
  getAdmins,
  updateAdmin,
  toggleAdminStatus,
  resetAdminPassword,
  deleteAdmin
} = require('../controllers/superAdminController');

// All routes require Superadmin authentication
router.use(requireSuperAdmin);

router.route('/admins')
  .get(getAdmins)
  .post(createAdmin);

router.route('/admins/:id')
  .put(updateAdmin)
  .delete(deleteAdmin);

router.put('/admins/:id/toggle', toggleAdminStatus);
router.put('/admins/:id/reset-password', resetAdminPassword);

module.exports = router;
