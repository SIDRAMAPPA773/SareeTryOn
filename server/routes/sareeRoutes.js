const express = require('express');
const router = express.Router();
const { getSarees, seedSarees, createSaree, updateSaree, deleteSaree } = require('../controllers/sareeController');
const { requireAdmin } = require('../middleware/adminAuthMiddleware');
const { upload } = require('../config/cloudinary');

// @route   GET /api/sarees
// @desc    Get all sarees
router.get('/', getSarees);

// @route   POST /api/sarees/seed
// @desc    Seed sample sarees
router.post('/seed', requireAdmin, seedSarees);

// @route   POST /api/sarees
// @desc    Create a new saree (Admin only)
router.post('/', requireAdmin, upload.single('image'), createSaree);

// @route   PUT /api/sarees/:id
// @desc    Update a saree (Admin only)
router.put('/:id', requireAdmin, upload.single('image'), updateSaree);

// @route   DELETE /api/sarees/:id
// @desc    Delete a saree
router.delete('/:id', requireAdmin, deleteSaree);

module.exports = router;
