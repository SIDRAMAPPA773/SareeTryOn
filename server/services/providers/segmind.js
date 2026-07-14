// Using Node.js built-in global fetch

/**
 * Provider implementation for Segmind IDM-VTON API
 */
const generateTryOn = async (userImageUrl, sareeImageUrl) => {
  console.log(`[SEGMIND] Starting IDM-VTON generation...`);

  if (!process.env.SEGMIND_API_KEY) {
    throw new Error('SEGMIND_API_KEY is not defined in environment variables.');
  }

  const modelEndpoint = 'https://api.segmind.com/v1/idm-vton';
  
  const payload = {
    human_img: userImageUrl,
    garm_img: sareeImageUrl,
    category: 'upper_body', // or dresses, but upper_body works well for saree tops/draping
    garment_des: 'Traditional Indian Saree',
    crop: false,
    seed: 42,
    steps: 30,
    mask_only: false,
    force_dc: false
  };

  const startTime = Date.now();
  let responseData;

  try {
    const response = await fetch(modelEndpoint, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.SEGMIND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Catch specific errors
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Unauthorized (401/403). Invalid SEGMIND_API_KEY. ${errorText}`);
      }
      if (response.status === 402 || response.status === 406) {
        throw new Error(`Insufficient Segmind Credits (${response.status}). ${errorText}`);
      }
      throw new Error(`Segmind API failed with status ${response.status}: ${errorText}`);
    }

    // Segmind returns the image directly as a binary blob for some endpoints, 
    // or as a base64 JSON string depending on the exact endpoint output format.
    // Let's check Content-Type
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('image/')) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:${contentType};base64,${buffer.toString('base64')}`;
        responseData = { image: base64Image };
    } else {
        responseData = await response.json();
    }

  } catch (apiError) {
    console.error(`[SEGMIND] Error:`, apiError.message);
    throw new Error(`Segmind API Failure: ${apiError.message}`);
  }

  const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`[SEGMIND] Generation Time: ${generationTime}s`);

  // Parse the output (either base64 in responseData.image or a direct URL)
  let finalImageUrl = null;
  
  if (responseData.image) {
      finalImageUrl = responseData.image; // Base64 data URI
  } else if (responseData.output && typeof responseData.output === 'string') {
      finalImageUrl = responseData.output;
  } else if (responseData.url) {
      finalImageUrl = responseData.url;
  }

  if (!finalImageUrl) {
    throw new Error(`Response Validation Failed: Invalid format returned from Segmind. Raw output keys: ${Object.keys(responseData).join(', ')}`);
  }

  console.log(`[SEGMIND] Pipeline Completed Successfully.`);

  return {
    generatedImageUrl: finalImageUrl,
    modelUsed: 'segmind/idm-vton',
    generationTimeSeconds: generationTime
  };
};

module.exports = {
  generateTryOn
};
