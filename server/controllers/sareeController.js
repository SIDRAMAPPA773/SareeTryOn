const Saree = require('../models/Saree');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all sarees from catalog
 * @route   GET /api/sarees
 * @access  Public
 */
const getSarees = async (req, res, next) => {
  try {
    const sarees = await Saree.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: sarees.length, data: sarees });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Seed sample sarees for database
 * @route   POST /api/sarees/seed
 * @access  Private/Admin
 */
const seedSarees = async (req, res, next) => {
  try {
    // Delete existing sarees to ensure a fresh catalog
    await Saree.deleteMany({});

    const sampleSarees = [
      {
        name: 'Crimson Red Banarasi',
        category: 'Silk',
        color: 'Red',
        fabric: 'Silk',
        description: 'Classic Banarasi wedding saree with intricate floral motifs. Perfect for bridal wear.',
        imageUrl: 'https://images.unsplash.com/photo-1583391733958-d25e07fac662?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Royal Blue Kanjivaram',
        category: 'Silk',
        color: 'Blue',
        fabric: 'Silk',
        description: 'Authentic pure silk Kanjivaram with heavy gold zari woven border.',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Emerald Green Organza',
        category: 'Organza',
        color: 'Green',
        fabric: 'Organza',
        description: 'Lightweight sheer organza saree with delicate silver border work.',
        imageUrl: 'https://images.unsplash.com/photo-1610030469722-6b9415664188?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Mustard Yellow Cotton',
        category: 'Cotton',
        color: 'Yellow',
        fabric: 'Cotton',
        description: 'Breathable handloom cotton saree perfect for everyday elegant wear.',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1682092603373-cf677611eaf9?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Lavender Floral Georgette',
        category: 'Georgette',
        color: 'Lavender',
        fabric: 'Georgette',
        description: 'Flowy georgette saree featuring intricate white floral embroidery.',
        imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Midnight Black Chiffon',
        category: 'Silk',
        color: 'Black',
        fabric: 'Chiffon',
        description: 'Sleek black chiffon party-wear saree with a subtle metallic sheen border.',
        imageUrl: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&q=80'
      }
    ];

    await Saree.insertMany(sampleSarees);
    res.status(201).json({ success: true, message: 'Database wiped and seeded with premium catalog successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new saree
 * @route   POST /api/sarees
 * @access  Private/Admin
 */
const createSaree = async (req, res, next) => {
  try {
    const { name, category, color, fabric, description, imageUrl } = req.body;

    if (!name || !category || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Please provide name, category, and imageUrl' });
    }

    const saree = await Saree.create({
      name,
      category,
      color,
      fabric,
      description,
      imageUrl
    });

    res.status(201).json({ success: true, data: saree });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a saree
 * @route   PUT /api/sarees/:id
 * @access  Private/Admin
 */
const updateSaree = async (req, res, next) => {
  try {
    let saree = await Saree.findById(req.params.id);

    if (!saree) {
      return res.status(404).json({ success: false, message: 'Saree not found' });
    }

    saree = await Saree.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: saree });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a saree
 * @route   DELETE /api/sarees/:id
 * @access  Private/Admin
 */
const deleteSaree = async (req, res, next) => {
  try {
    const saree = await Saree.findById(req.params.id);

    if (!saree) {
      return res.status(404).json({ success: false, message: 'Saree not found' });
    }

    await saree.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSarees,
  seedSarees,
  createSaree,
  updateSaree,
  deleteSaree
};
