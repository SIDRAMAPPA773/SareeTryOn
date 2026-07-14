/**
 * Provider implementation for FAL.ai Virtual Try-On
 */
const generateTryOn = async (userImageUrl, sareeImageUrl) => {
  console.log(`[FAL.AI] Starting Virtual Try-On generation...`);
  
  if (!process.env.FAL_KEY) {
    throw new Error('FAL_KEY is not defined in environment variables.');
  }

  const apiKey = process.env.FAL_KEY;
  const startTime = Date.now();

  // Audit of best FAL.ai VTON models in priority order based on quality and saree suitability
  const modelEndpoints = [
    {
      id: 'fal-ai/idm-vton',
      url: 'https://fal.run/fal-ai/idm-vton',
      payload: (human, garm) => ({
        human_image_url: human,
        garment_image_url: garm,
        description: 'saree, traditional indian wear, highly detailed drape',
        category: 'dresses' // Sarees are full body
      })
    },
    {
      id: 'fal-ai/cat-vton',
      url: 'https://fal.run/fal-ai/cat-vton',
      payload: (human, garm) => ({
        human_image_url: human,
        garment_image_url: garm,
        cloth_type: 'overall'
      })
    },
    {
      id: 'fal-ai/fashn-vton',
      url: 'https://fal.run/fal-ai/fashn-vton',
      payload: (human, garm) => ({
        model_image: human,
        garment_image: garm,
        category: 'dresses'
      })
    }
  ];

  let lastError = null;

  // Robust Fallback Execution Strategy
  for (const model of modelEndpoints) {
    console.log(`[FAL.AI] Attempting inference with model: ${model.id}`);
    
    try {
      const response = await fetch(model.url, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(model.payload(userImageUrl, sareeImageUrl))
      });

      const dataText = await response.text();
      let data = {};
      try { data = JSON.parse(dataText); } catch(e) {}

      // Stop immediately if blocked by account credits/balance
      if (response.status === 402 || response.status === 403 || (data.detail && data.detail.includes('Exhausted balance'))) {
        throw new Error(`Insufficient FAL.ai Credits (${response.status}). ${data.detail || dataText}`);
      }

      if (response.status === 404) {
        console.warn(`[FAL.AI] Model ${model.id} is deprecated or unavailable (404). Falling back...`);
        lastError = new Error(`${model.id} is unavailable (404)`);
        continue;
      }

      if (!response.ok) {
        console.warn(`[FAL.AI] Model ${model.id} failed with status ${response.status}: ${dataText}`);
        lastError = new Error(`API Error ${response.status}: ${dataText}`);
        continue; // Fallback to next model
      }

      // Success
      let finalImageUrl = null;
      if (data.image && data.image.url) {
        finalImageUrl = data.image.url;
      } else if (data.url) {
        finalImageUrl = data.url;
      }

      if (!finalImageUrl) {
         throw new Error(`Invalid response structure from ${model.id}: ${JSON.stringify(data)}`);
      }

      const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`[FAL.AI] Successfully generated using ${model.id} in ${generationTime}s`);

      return {
        generatedImageUrl: finalImageUrl,
        modelUsed: model.id,
        generationTimeSeconds: generationTime
      };

    } catch (err) {
      // If error is explicitly due to balance, STOP and bubble it up immediately
      if (err.message.includes('Insufficient FAL.ai Credits')) {
        throw err;
      }
      console.error(`[FAL.AI] Exception using ${model.id}:`, err.message);
      lastError = err;
    }
  }

  // If all models failed for reasons other than balance
  throw new Error(`All FAL.ai fallback models failed. Last Error: ${lastError.message}`);
};

module.exports = {
  generateTryOn
};
