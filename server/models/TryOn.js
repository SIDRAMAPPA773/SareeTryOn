const mongoose = require('mongoose');

const TryOnSchema = new mongoose.Schema({
  userImageUrl: {
    type: String,
    required: [true, 'User image URL is required']
  },
  sareeImageUrl: {
    type: String,
    required: [true, 'Saree image URL is required']
  },
  generatedImageUrl: {
    type: String
  },
  promptUsed: {
    type: String
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TryOn', TryOnSchema);
