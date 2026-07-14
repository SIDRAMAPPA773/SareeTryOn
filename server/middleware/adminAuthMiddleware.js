const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'changeme-generate-with-openssl-rand-hex-32';
const ADMIN_COOKIE_NAME = 'admin_token';

const requireAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies[ADMIN_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Admin session required — please log in at /admin/login'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: `Admin token invalid or expired: ${err.message}`
      });
    }

    if (decoded.type !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin token type'
      });
    }

    // Double check admin user exists in DB
    const adminUser = await AdminUser.findById(decoded.sub);
    if (!adminUser) {
      return res.status(401).json({
        success: false,
        message: 'Admin user no longer exists'
      });
    }

    req.admin = {
      id: adminUser._id,
      username: adminUser.username,
      role: adminUser.role
    };

    next();
  } catch (error) {
    next(error);
  }
};

const requireSuperAdminAuth = async (req, res, next) => {
  requireAdminAuth(req, res, (err) => {
    if (err) return next(err);
    if (req.admin.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Super Admin access required'
      });
    }
    next();
  });
};

module.exports = {
  requireAdminAuth,
  requireSuperAdminAuth,
  ADMIN_JWT_SECRET,
  ADMIN_COOKIE_NAME
};
