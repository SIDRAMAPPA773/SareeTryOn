const mongoose = require('mongoose');
const Saree = require('./models/Saree');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/body-try-on');
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
  console.log("Seeded");
  process.exit(0);
}
seed();
