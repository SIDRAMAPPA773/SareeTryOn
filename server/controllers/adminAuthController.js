const bcrypt = require('bcrypt');
const AdminUser = require('../models/AdminUser');

/**
 * @desc    Admin Login
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username/email and password' });
    }

    const admin = await AdminUser.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail.toLowerCase() }]
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: 'Account disabled' });
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

    // Create session
    req.session.adminId = admin._id;
    req.session.role = admin.role;

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Logout
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Could not log out' });
      }
      res.clearCookie('connect.sid'); // Default cookie name for express-session
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Current Admin
 * @route   GET /api/auth/me
 * @access  Private
 */
const me = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.admin // Populated by requireAuth middleware
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  me
};
