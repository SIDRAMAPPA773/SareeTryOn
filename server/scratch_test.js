require('dotenv').config();
const aiProviderFactory = require('../services/aiProviderFactory');

async function test() {
  console.log("TESTING SEGMIND API VIA FACTORY...");
  const humanUrl = "https://raw.githubusercontent.com/Zheng-Chong/CatVTON/main/examples/person/1.jpg";
  const garmUrl = "https://raw.githubusercontent.com/Zheng-Chong/CatVTON/main/examples/garment/1.jpg";
  
  try {
    const result = await aiProviderFactory.generate(humanUrl, garmUrl);
    console.log("SUCCESS:", result);
  } catch (err) {
    console.error("FAILED:", err.message);
  }
}

test();
