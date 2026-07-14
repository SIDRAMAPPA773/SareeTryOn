const mongoose = require('mongoose');
const Saree = require('./models/Saree');
require('dotenv').config();

const fabrics = ['Silk', 'Organza', 'Georgette', 'Cotton'];
const colors = ['Crimson Red', 'Royal Blue', 'Emerald Green', 'Mustard Yellow', 'Midnight Black', 'Rose Pink', 'Pure White', 'Deep Purple'];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/body-try-on');
  await Saree.deleteMany({});
  
  const sampleSarees = [];
  
  for (let i = 0; i < 24; i++) {
    const fabric = fabrics[i % fabrics.length];
    const color = colors[i % colors.length];
    
    // Generate a perfect flat-lay saree image using Pollinations AI
    const prompt = `Premium flat lay photography of a beautiful ${color} ${fabric} Indian saree, luxury textile, pristine white background, studio lighting`;
    const encodedPrompt = encodeURIComponent(prompt);
    // Add seed so they don't randomly change on every render
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=600&height=800&nologo=true&seed=${1000 + i}`;

    sampleSarees.push({
      name: `Premium Designer ${fabric} Saree Vol.${i + 1}`,
      category: fabric,
      color: color,
      fabric: fabric,
      description: `Exclusive high-end luxury ${fabric} saree in ${color}. Perfect for festive occasions with intricate borders and flawless drape.`,
      imageUrl: imageUrl
    });
  }
  
  await Saree.insertMany(sampleSarees);
  console.log(`Seeded ${sampleSarees.length} perfectly curated sarees!`);
  process.exit(0);
}
seed();
