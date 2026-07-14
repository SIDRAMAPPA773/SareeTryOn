const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firebase_uid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  name: {
    type: String,
    default: ''
  },
  avatar_url: {
    type: String,
    default: ''
  },
  plan: {
    type: String,
    default: 'free'
  },
  plan_id: {
    type: String,
    default: 'free'
  },
  credits: {
    type: Number,
    default: 0
  },
  credits_used_total: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['USER', 'SUPPORT_ADMIN', 'FINANCE_ADMIN', 'SUPER_ADMIN'],
    default: 'USER'
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  is_suspended: {
    type: Boolean,
    default: false
  },
  subscription_id: {
    type: String,
    default: null
  },
  subscription_status: {
    type: String,
    default: null
  },
  plan_expires_at: {
    type: Date,
    default: null
  },
  razorpay_customer_id: {
    type: String,
    default: null
  },
  credits_reset_at: {
    type: Date,
    default: null
  },
  last_active_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Sync is_admin field based on role
UserSchema.pre('save', function(next) {
  if (['SUPPORT_ADMIN', 'FINANCE_ADMIN', 'SUPER_ADMIN'].includes(this.role)) {
    this.is_admin = true;
  } else {
    this.is_admin = false;
  }
  
  if (this.status === 'suspended') {
    this.is_suspended = true;
  } else {
    this.is_suspended = false;
  }
  
  next();
});

module.exports = mongoose.model('User', UserSchema);
