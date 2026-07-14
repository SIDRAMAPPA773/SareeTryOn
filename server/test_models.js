require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    // According to @google/genai docs, how to list models?
    // Let's just try gemini-2.0-flash and gemini-2.5-pro using a very basic prompt
    const modelsToTest = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-pro', 'gemini-pro-vision'];
    for (const model of modelsToTest) {
      try {
        console.log(`Testing ${model}...`);
        const response = await ai.models.generateContent({
          model: model,
          contents: 'hello'
        });
        console.log(`SUCCESS: ${model} works! Response: ${response.text}`);
        return; // found one!
      } catch (err) {
        console.log(`FAILED: ${model} -> ${err.message}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

test();
