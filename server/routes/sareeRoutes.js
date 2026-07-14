const express = require('express');
const router = express.Router();
const { getSarees, seedSarees } = require('../controllers/sareeController');

// @route   GET /api/sarees
// @desc    Get all sarees
router.get('/', getSarees);

// @route   POST /api/sarees/seed
// @desc    Seed sample sarees
router.post('/seed', seedSarees);

module.exports = router;
