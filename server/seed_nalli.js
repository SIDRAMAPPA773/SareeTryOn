const mongoose = require('mongoose');
const axios = require('axios');
const Saree = require('./models/Saree');
require('dotenv').config();

const colorsList = ["Red", "Blue", "Green", "Yellow", "Black", "White", "Pink", "Maroon", "Purple", "Orange", "Grey", "Brown", "Gold", "Silver", "Lavender", "Mustard", "Emerald", "Crimson", "Navy"];

function extractColor(title) {
  for (let color of colorsList) {
    if (title.toLowerCase().includes(color.toLowerCase())) {
      return color;
    }
  }
  return "Multicolor";
}

function extractFabric(title, type) {
  const t = (title + " " + type).toLowerCase();
  if (t.includes('silk')) return 'Silk';
  if (t.includes('cotton')) return 'Cotton';
  if (t.includes('georgette')) return 'Georgette';
  if (t.includes('organza')) return 'Organza';
  if (t.includes('chiffon')) return 'Chiffon';
  if (t.includes('crepe')) return 'Crepe';
  if (t.includes('linen')) return 'Linen';
  return 'Silk'; // fallback
}

function extractCategory(type) {
    if (!type) return 'Saree';
    return type;
}

async function seedNalli() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/body-try-on');
    
    console.log("Fetching from nalli.com...");
    const res = await axios.get('https://www.nalli.com/products.json?limit=25');
    const products = res.data.products;
    
    const sampleSarees = [];
    
    for (let p of products) {
        if (!p.images || p.images.length === 0) continue;
        
        // Skip if title is too long (schema max 100)
        let name = p.title;
        if (name.length > 100) name = name.substring(0, 97) + '...';
        
        let rawDesc = (p.body_html || '').replace(/(<([^>]+)>)/gi, "");
        if (rawDesc.length > 495) rawDesc = rawDesc.substring(0, 495) + '...';
        if (!rawDesc) rawDesc = name;

        sampleSarees.push({
            name: name,
            category: extractCategory(p.product_type),
            color: extractColor(p.title),
            fabric: extractFabric(p.title, p.product_type),
            description: rawDesc,
            imageUrl: p.images[0].src
        });
    }
    
    console.log(`Inserting ${sampleSarees.length} Nalli sarees into DB...`);
    await Saree.insertMany(sampleSarees);
    console.log("Seeded Nalli successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding Nalli:", err);
    process.exit(1);
  }
}

seedNalli();
