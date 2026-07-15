const bcrypt = require('bcrypt');
const AdminUser = require('../models/AdminUser');

/**
 * @desc    Create new Admin
 * @route   POST /api/superadmin/admins
 * @access  Private (Superadmin)
 */
const createAdmin = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username, email, and password' });
    }

    const existingAdmin = await AdminUser.findOne({ $or: [{ username }, { email: email.toLowerCase() }] });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Username or Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newAdmin = await AdminUser.create({
      username,
      email,
      password_hash,
      role: role === 'SUPERADMIN' ? 'SUPERADMIN' : 'ADMIN'
    });

    res.status(201).json({
      success: true,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
        isActive: newAdmin.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all Admins (excluding Superadmins)
 * @route   GET /api/superadmin/admins
 * @access  Private (Superadmin)
 */
const getAdmins = async (req, res, next) => {
  try {
    const admins = await AdminUser.find({ role: { $ne: 'SUPERADMIN' } })
      .select('-password_hash')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Admin
 * @route   PUT /api/superadmin/admins/:id
 * @access  Private (Superadmin)
 */
const updateAdmin = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const admin = await AdminUser.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    
    if (admin.role === 'SUPERADMIN') {
      return res.status(403).json({ success: false, message: 'Cannot modify another Superadmin' });
    }

    if (username) admin.username = username;
    if (email) admin.email = email.toLowerCase();

    await admin.save();

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle Admin Status (Enable/Disable)
 * @route   PUT /api/superadmin/admins/:id/toggle
 * @access  Private (Superadmin)
 */
const toggleAdminStatus = async (req, res, next) => {
  try {
    const admin = await AdminUser.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (admin.role === 'SUPERADMIN') {
      return res.status(403).json({ success: false, message: 'Cannot modify another Superadmin' });
    }

    admin.isActive = !admin.isActive;
    await admin.save();

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Admin Password
 * @route   PUT /api/superadmin/admins/:id/reset-password
 * @access  Private (Superadmin)
 */
const resetAdminPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a new password' });
    }

    const admin = await AdminUser.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (admin.role === 'SUPERADMIN') {
      return res.status(403).json({ success: false, message: 'Cannot modify another Superadmin' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password_hash = await bcrypt.hash(password, salt);
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Admin
 * @route   DELETE /api/superadmin/admins/:id
 * @access  Private (Superadmin)
 */
const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await AdminUser.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (admin.role === 'SUPERADMIN') {
      return res.status(403).json({ success: false, message: 'Cannot delete another Superadmin' });
    }

    await admin.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAdmin,
  getAdmins,
  updateAdmin,
  toggleAdminStatus,
  resetAdminPassword,
  deleteAdmin
};
