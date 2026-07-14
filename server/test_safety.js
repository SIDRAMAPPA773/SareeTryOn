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
        { text: 'ROLE\nYou are an expert Indian Fashion AI specialized in realistic virtual saree try-on.\nTASK\nYou will receive:\nImage 1: Full body image of a real woman.\nImage 2: Reference saree.\nReplace ONLY the clothing.\nReturn only the edited image.' },
        userImagePart,
        sareeImagePart
      ]
    });
    console.log("Response text length:", response.text ? response.text.length : 0);
    console.log("Full response object:", JSON.stringify(response, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
