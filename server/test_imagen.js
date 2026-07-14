require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-001',
      prompt: 'A beautiful Indian saree on a mannequin, highly detailed, ultra realistic, 8k resolution',
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '3:4'
      }
    });
    console.log('SUCCESS, generated image format:', response.generatedImages[0].image.mimeType);
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

test();
