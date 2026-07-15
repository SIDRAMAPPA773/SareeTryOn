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

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Helper to get transporter
const getTransporter = async () => {
  // Use real SMTP if provided
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // Fallback to Ethereal for testing
  let testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * @desc    Forgot Password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'No admin found with that email' });
    }

    // Generate Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and set to database
    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    admin.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    await admin.save();

    // Create reset url
    const frontendUrl = process.env.FRONTEND_URL || 'https://sareetryonproject.netlify.app';
    const resetUrl = `${frontendUrl}/admin/reset-password?token=${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}`;

    try {
      const transporter = await getTransporter();
      
      const info = await transporter.sendMail({
        from: '"Virtual Couture Admin" <noreply@virtualcouture.com>',
        to: admin.email,
        subject: 'Password Reset Request',
        text: message
      });

      console.log("Message sent: %s", info.messageId);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("Preview URL: %s", previewUrl);
      }

      res.status(200).json({ success: true, message: 'Email sent', previewUrl });
    } catch (err) {
      console.error(err);
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpires = undefined;
      await admin.save();
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
       return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    // Hash token from body to compare with DB
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const admin = await AdminUser.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    admin.password_hash = await bcrypt.hash(password, salt);
    
    // Clear token fields
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  me,
  forgotPassword,
  resetPassword
};
