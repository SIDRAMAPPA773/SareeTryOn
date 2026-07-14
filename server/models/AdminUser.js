const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['SUPPORT_ADMIN', 'FINANCE_ADMIN', 'SUPER_ADMIN'],
    default: 'SUPPORT_ADMIN'
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);
