const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'SUPERADMIN'],
    default: 'ADMIN'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  last_login_at: {
    type: Date
  },
  failed_attempts: {
    type: Number,
    default: 0
  },
  lockout_until: {
    type: Date,
    default: null
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);
