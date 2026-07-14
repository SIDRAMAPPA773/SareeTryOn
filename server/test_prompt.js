require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const fetchImageAsInlineData = async (url) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType: 'image/jpeg'
    }
  };
};

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const modelName = 'gemini-2.5-flash';
  
  try {
    const userImagePart = await fetchImageAsInlineData('https://res.cloudinary.com/dtm9gs0rt/image/upload/v1782379328/r1wcqfsdbiy9f45gwm1y.jpg');
    const sareeImagePart = await fetchImageAsInlineData('https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80');

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        { text: 'Look at these two images. Please return the word "RECEIVED" and describe them briefly. Do not attempt to generate an image.' },
        userImagePart,
        sareeImagePart
      ]
    });
    console.log("Response text:", response.text);
    console.log("Finish reason:", response.candidates[0].finishReason);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
