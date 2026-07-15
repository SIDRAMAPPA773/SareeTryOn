const AdminUser = require('../models/AdminUser');

const requireAuth = async (req, res, next) => {
  try {
    if (!req.session || !req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Session required — please log in at /admin/login'
      });
    }

    const adminUser = await AdminUser.findById(req.session.adminId);
    if (!adminUser) {
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'Admin user no longer exists'
      });
    }

    if (!adminUser.isActive) {
      req.session.destroy();
      return res.status(403).json({
        success: false,
        message: 'Admin account is disabled'
      });
    }

    req.admin = {
      id: adminUser._id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role
    };

    next();
  } catch (error) {
    next(error);
  }
};

const requireAdmin = async (req, res, next) => {
  requireAuth(req, res, (err) => {
    if (err) return next(err);
    if (req.admin.role !== 'ADMIN' && req.admin.role !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    next();
  });
};

const requireSuperAdmin = async (req, res, next) => {
  requireAuth(req, res, (err) => {
    if (err) return next(err);
    if (req.admin.role !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Super Admin access required'
      });
    }
    next();
  });
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireSuperAdmin
};
