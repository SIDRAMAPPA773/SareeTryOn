const Catalog = require('../models/Catalog');

/**
 * @desc    Get all catalogs
 * @route   GET /api/catalogs
 * @access  Public
 */
const getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await Catalog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: catalogs.length, data: catalogs });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a catalog
 * @route   POST /api/catalogs
 * @access  Private/Admin
 */
const createCatalog = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    let coverImage = '';

    if (req.file) {
      coverImage = req.file.path; // Cloudinary URL provided by multer-storage-cloudinary
    }

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a catalog name' });
    }

    // Check for duplicate catalog name
    const existingCatalog = await Catalog.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCatalog) {
      return res.status(400).json({ success: false, message: 'A catalog with this name already exists' });
    }

    const catalog = await Catalog.create({
      name,
      description,
      coverImage
    });

    res.status(201).json({ success: true, data: catalog });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a catalog
 * @route   PUT /api/catalogs/:id
 * @access  Private/Admin
 */
const updateCatalog = async (req, res, next) => {
  try {
    let catalog = await Catalog.findById(req.params.id);

    if (!catalog) {
      return res.status(404).json({ success: false, message: 'Catalog not found' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.coverImage = req.file.path;
    }

    catalog = await Catalog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: catalog });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a catalog
 * @route   DELETE /api/catalogs/:id
 * @access  Private/Admin
 */
const deleteCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findById(req.params.id);

    if (!catalog) {
      return res.status(404).json({ success: false, message: 'Catalog not found' });
    }

    await catalog.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCatalogs,
  createCatalog,
  updateCatalog,
  deleteCatalog
};
