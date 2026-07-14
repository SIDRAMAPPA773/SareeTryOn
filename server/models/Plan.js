const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price_inr: {
    type: Number, // in paise (e.g., ₹499 = 49900 paise)
    default: 0
  },
  credits: {
    type: Number,
    default: 0
  },
  features: {
    type: [String],
    default: []
  },
  download_glb: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  sort_order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', PlanSchema);
