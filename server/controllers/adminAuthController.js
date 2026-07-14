const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { ADMIN_JWT_SECRET, ADMIN_COOKIE_NAME } = require('../middleware/adminAuthMiddleware');

const ADMIN_TOKEN_TTL_HOURS = parseInt(process.env.ADMIN_TOKEN_TTL_HOURS || '8');

/**
 * @desc    Admin Login
 * @route   POST /admin/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { username, password, rememberMe } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    const admin = await AdminUser.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check lockout
    if (admin.lockout_until && admin.lockout_until > new Date()) {
      const remainingMin = Math.ceil((admin.lockout_until - new Date()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account locked due to too many failed attempts. Try again in ${remainingMin} minutes.`
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      admin.failed_attempts += 1;
      if (admin.failed_attempts >= 5) {
        admin.lockout_until = new Date(Date.now() + 30 * 60000); // 30 mins lockout
        admin.failed_attempts = 0;
      }
      await admin.save();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Reset failed attempts on success
    admin.failed_attempts = 0;
    admin.lockout_until = null;
    admin.last_login_at = new Date();
    await admin.save();

    // Create token
    const expiresIn = rememberMe ? '30d' : `${ADMIN_TOKEN_TTL_HOURS}h`;
    const token = jwt.sign(
      {
        sub: admin._id,
        role: admin.role,
        type: 'admin'
      },
      ADMIN_JWT_SECRET,
      { expiresIn }
    );

    // Set cookie
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : ADMIN_TOKEN_TTL_HOURS * 60 * 60 * 1000;
    res.cookie(ADMIN_COOKIE_NAME, token, {
      maxAge,
      httpOnly: true,
      secure: false, // Set to true in production (HTTPS)
      sameSite: 'lax',
      path: '/'
    });

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Logout
 * @route   POST /admin/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie(ADMIN_COOKIE_NAME, { path: '/' });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Current Admin
 * @route   GET /admin/auth/me
 * @access  Private
 */
const me = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.admin
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create Admin (Super Admin only, or public if no admins exist)
 * @route   POST /admin/auth/create
 * @access  Public/Private
 */
const createAdmin = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    // If admins exist, require Super Admin to create new ones
    const adminCount = await AdminUser.countDocuments();
    if (adminCount > 0) {
      // Check if current request is authenticated as Super Admin
      const token = req.cookies[ADMIN_COOKIE_NAME];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Super Admin credentials required to create additional admins' });
      }

      try {
        const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
        if (decoded.role !== 'SUPER_ADMIN') {
          return res.status(403).json({ success: false, message: 'Only Super Admins can create new admins' });
        }
      } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newAdmin = await AdminUser.create({
      username,
      password_hash,
      role: role || 'SUPPORT_ADMIN'
    });

    res.status(201).json({
      success: true,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        role: newAdmin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  me,
  createAdmin
};
