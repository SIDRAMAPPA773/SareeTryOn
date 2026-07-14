const mongoose = require('mongoose');

const Model3DSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  id: {
    type: String,
    required: false,
    index: true
  },
  user_id: {
    type: String, // Firebase uid or MongoDB User id
    required: true,
    index: true
  },
  job_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail_url: {
    type: String,
    default: ''
  },
  glb_url: {
    type: String,
    required: true
  },
  storage_path: {
    type: String,
    default: ''
  },
  file_size_bytes: {
    type: Number,
    default: 0
  },
  embed_code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Model3D', Model3DSchema);
