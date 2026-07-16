const mongoose = require('mongoose');

const SareeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a saree name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  catalogId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Catalog',
    required: false
  },
  color: {
    type: String,
    required: [true, 'Please add a color'],
    trim: true
  },
  fabric: {
    type: String,
    required: [true, 'Please add a fabric type'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Saree', SareeSchema);
