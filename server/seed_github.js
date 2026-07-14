const mongoose = require('mongoose');
const Saree = require('./models/Saree');
require('dotenv').config();

const fabrics = ['Silk', 'Organza', 'Georgette', 'Cotton', 'Banarasi', 'Kanjivaram'];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/body-try-on');
  await Saree.deleteMany({});
  
  const sampleSarees = [];
  
  for (let i = 1; i <= 40; i++) {
    const fIdx = i % fabrics.length;
    const fabric = fabrics[fIdx];
    
    // Direct raw image from the GitHub repository
    const imageUrl = `https://raw.githubusercontent.com/ErAdilrasheed/MauMart_Online_Saree_Store/main/images/${i}.webp`;

    sampleSarees.push({
      name: `SareeVerse Designer ${fabric} Saree Vol.${i}`,
      category: fabric,
      color: ['Red', 'Blue', 'Green', 'Pink', 'Black', 'Gold', 'White', 'Purple'][i % 8],
      fabric: fabric,
      description: `Authentic saree from SareeVerse Online Store. Beautiful design and pattern.`,
      imageUrl: imageUrl
    });
  }
  
  await Saree.insertMany(sampleSarees);
  console.log(`Seeded ${sampleSarees.length} sarees from SareeVerse Repo!`);
  process.exit(0);
}
seed();
