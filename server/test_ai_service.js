require('dotenv').config();
const { generateTryOnImage } = require('./services/aiService');

(async () => {
  try {
    console.log("Starting test execution of AI Service...");
    const result = await generateTryOnImage(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c'
    );
    console.log('\n--- TEST SUCCESS ---');
    console.log('Returned AI Result:', result);
  } catch (error) {
    console.error('\n--- TEST FAILURE ---');
    console.error(error);
  }
})();
