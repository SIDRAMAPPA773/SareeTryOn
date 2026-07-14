const mongoose = require('mongoose');

const AdminActivityLogSchema = new mongoose.Schema({
  admin_user_id: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true
  },
  target_type: {
    type: String,
    default: ''
  },
  target_id: {
    type: String,
    default: ''
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ip_address: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminActivityLog', AdminActivityLogSchema);
