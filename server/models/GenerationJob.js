const mongoose = require('mongoose');

const GenerationJobSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user_id: {
    type: String,
    required: true,
    index: true
  },
  input_image_url: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  progress: {
    type: Number,
    default: 0
  },
  meshy_task_id: {
    type: String,
    default: null
  },
  credits_consumed: {
    type: Number,
    default: 30
  },
  credits_refunded: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  unique_code: {
    type: String,
    unique: true
  },
  original_filename: {
    type: String
  },
  model_url: {
    type: String,
    default: null
  },
  file_ext: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GenerationJob', GenerationJobSchema);
