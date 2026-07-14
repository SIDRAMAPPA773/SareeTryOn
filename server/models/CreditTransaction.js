const mongoose = require('mongoose');

const CreditTransactionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  change_amount: {
    type: Number,
    required: true
  },
  before_balance: {
    type: Number,
    required: true
  },
  after_balance: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true, // e.g., 'GENERATION', 'PURCHASE', 'REFUND', 'ADMIN_ADJUST'
    index: true
  },
  reference_id: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CreditTransaction', CreditTransactionSchema);
