const express = require('express');
const router = express.Router();
const { getCatalogs, createCatalog, updateCatalog, deleteCatalog } = require('../controllers/catalogController');
const { requireAdmin } = require('../middleware/adminAuthMiddleware');
const { upload } = require('../config/cloudinary');

// @route   GET /api/catalogs
// @desc    Get all catalogs
router.get('/', getCatalogs);

// @route   POST /api/catalogs
// @desc    Create a catalog
router.post('/', requireAdmin, upload.single('coverImage'), createCatalog);

// @route   PUT /api/catalogs/:id
// @desc    Update a catalog
router.put('/:id', requireAdmin, upload.single('coverImage'), updateCatalog);

// @route   DELETE /api/catalogs/:id
// @desc    Delete a catalog
router.delete('/:id', requireAdmin, deleteCatalog);

module.exports = router;
