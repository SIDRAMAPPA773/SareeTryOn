require('dotenv').config();
const mongoose = require('mongoose');
const Saree = require('./models/Saree');
const Catalog = require('./models/Catalog');

async function migrateCatalogs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for migration.');

    const sarees = await Saree.find({});
    console.log(`Found ${sarees.length} sarees.`);

    const categories = new Set();
    const categoryToImage = {};

    sarees.forEach(s => {
      if (s.category && !s.catalogId) {
        categories.add(s.category);
        if (!categoryToImage[s.category] && s.imageUrl) {
          categoryToImage[s.category] = s.imageUrl;
        }
      }
    });

    console.log('Unique legacy categories found:', Array.from(categories));

    for (const cat of categories) {
      const existing = await Catalog.findOne({ name: { $regex: new RegExp(`^${cat}$`, 'i') } });
      if (!existing) {
        const newCatalog = await Catalog.create({
          name: cat,
          description: `Legacy catalog for ${cat}`,
          coverImage: categoryToImage[cat] || ''
        });
        console.log(`Created catalog: ${newCatalog.name}`);
        
        // Optionally update the sarees to point to this new catalog
        await Saree.updateMany(
          { category: cat, catalogId: { $exists: false } },
          { $set: { catalogId: newCatalog._id } }
        );
      } else {
        console.log(`Catalog ${cat} already exists.`);
        // Update sarees that don't have the ID
        await Saree.updateMany(
          { category: cat, catalogId: { $exists: false } },
          { $set: { catalogId: existing._id } }
        );
      }
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrateCatalogs();
