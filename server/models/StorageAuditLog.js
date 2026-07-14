const mongoose = require('mongoose');

const StorageAuditLogSchema = new mongoose.Schema({
  model_id: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true // e.g., 'UPLOAD', 'DELETE', 'VERIFY', 'REPAIR'
  },
  result: {
    type: String,
    required: true // 'success' or 'failed'
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StorageAuditLog', StorageAuditLogSchema);
