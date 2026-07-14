const Replicate = require('replicate');
const crypto = require('crypto');

/**
 * Service to execute the CatVTON virtual try-on via Replicate API.
 * 
 * @param {string} userImageUrl - The full body image of the user (Cloudinary URL).
 * @param {string} sareeImageUrl - The selected saree image (Cloudinary URL).
 * @returns {Promise<Object>} The generated AI image URL and metadata.
 */
const generateTryOn = async (userImageUrl, sareeImageUrl) => {
  console.log('\n--- [CATVTON API] PIPELINE START ---');
  console.log(`[LOG] User Image: ${userImageUrl}`);
  console.log(`[LOG] Saree Image: ${sareeImageUrl}`);

  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN is not defined in environment variables.');
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const requestId = crypto.randomUUID();
  console.log(`[LOG] Request ID: ${requestId}`);

  const modelVersion = 'mmezhov/catvton-flux:cc41d1b963023987ed2ddf26e9264efcc96ee076640115c303f95b0010f6a958';
  
  const payload = {
    image: userImageUrl,
    garment: sareeImageUrl,
    try_on: true
  };

  console.log(`[LOG] Executing Replicate model: ${modelVersion}`);
  console.log(`[LOG] Request Payload:`, JSON.stringify(payload, null, 2));

  const startTime = Date.now();
  let output;

  try {
    // Call Replicate CatVTON API
    output = await replicate.run(modelVersion, { input: payload });
  } catch (apiError) {
    console.error(`[LOG] CatVTON API Error:`, apiError.message);
    
    // Check for specific Replicate API failures
    if (apiError.response && apiError.response.status === 402) {
      throw new Error(`Insufficient Replicate API Credits (402 Payment Required). Please top up your Replicate account.`);
    }
    if (apiError.response && apiError.response.status === 401) {
      throw new Error(`Unauthorized (401). Invalid REPLICATE_API_TOKEN.`);
    }
    
    throw new Error(`CatVTON API Failure: ${apiError.message}`);
  }

  const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`[LOG] CatVTON API Generation Time: ${generationTime}s`);
  console.log(`[LOG] CatVTON Raw Output:`, output);

  // Response Validation
  if (!output) {
    throw new Error('Response Validation Failed: No output returned from CatVTON API.');
  }
  
  // Replicate output format usually returns an array of URLs or a single URL string for image models
  let finalImageUrl = null;
  if (Array.isArray(output) && output.length > 0) {
    finalImageUrl = output[0];
  } else if (typeof output === 'string') {
    finalImageUrl = output;
  }
  
  // Strict Validation to ensure it's not a placeholder
  if (!finalImageUrl || typeof finalImageUrl !== 'string' || !finalImageUrl.startsWith('http')) {
    throw new Error(`Response Validation Failed: Invalid image URL returned. Raw output: ${JSON.stringify(output)}`);
  }

  console.log(`[LOG] CatVTON Pipeline Completed Successfully. Generated URL: ${finalImageUrl}`);

  return {
    generatedImageUrl: finalImageUrl,
    modelUsed: modelVersion,
    generationTimeSeconds: generationTime
  };
};

module.exports = {
  generateTryOn
};
