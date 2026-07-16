const mongoose = require('mongoose');

const CatalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a catalog name'],
    trim: true,
    unique: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  coverImage: {
    type: String, // Cloudinary URL
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Catalog', CatalogSchema);
