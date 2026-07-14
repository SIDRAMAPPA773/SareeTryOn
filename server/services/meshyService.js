const fs = require('fs');
const path = require('path');

const MESHY_BASE_URL = 'https://api.meshy.ai/openapi/v1';

/**
 * Submits an image to Meshy's Image-to-3D endpoint.
 */
async function submitToMeshy(image_data_uri, apiKey, options = {}) {
  const {
    ai_model = 'latest',
    polycount = 50000,
    topology = 'triangle',
    should_texture = true,
    enable_pbr = true,
    symmetry_mode = 'auto',
    remove_lighting = true,
    image_enhancement = true,
  } = options;

  if (!apiKey) {
    throw new Error('Meshy API key is missing');
  }

  const payload = {
    image_url: image_data_uri,
    ai_model,
    should_texture,
    enable_pbr,
    topology,
    target_polycount: polycount,
    symmetry_mode,
    should_remesh: true,
  };

  if (ai_model === 'latest' || ai_model === 'meshy-6') {
    payload.remove_lighting = remove_lighting;
    payload.image_enhancement = image_enhancement;
  }

  console.log('Submitting task to Meshy API...');
  const response = await fetch(`${MESHY_BASE_URL}/image-to-3d`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Meshy API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const taskId = data.result;
  if (!taskId) {
    throw new Error(`No task_id in Meshy response: ${JSON.stringify(data)}`);
  }

  return taskId;
}

/**
 * Polls Meshy task status until it succeeds or fails.
 */
async function pollTaskStatus(taskId, apiKey, pollIntervalMs = 5000, timeoutMs = 600000) {
  const headers = { 'Authorization': `Bearer ${apiKey}` };
  const url = `${MESHY_BASE_URL}/image-to-3d/${taskId}`;
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Meshy polling error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const status = data.status;
    const progress = data.progress || 0;

    console.log(`Meshy Task ${taskId} status: ${status} (${progress}%)`);

    if (status === 'SUCCEEDED') {
      return data;
    }

    if (status === 'FAILED') {
      const errorMsg = data.task_error?.message || 'Unknown error';
      throw new Error(`Meshy task failed: ${errorMsg}`);
    }

    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`Task ${taskId} did not complete within timeout`);
}

/**
 * Downloads the GLB model from a completed Meshy task and saves it locally.
 */
async function downloadGlbFile(taskResult, outputPath) {
  const glbUrl = taskResult.model_urls?.glb;
  if (!glbUrl) {
    throw new Error(`No GLB URL in task result: ${JSON.stringify(taskResult)}`);
  }

  console.log(`Downloading GLB from: ${glbUrl}`);
  const response = await fetch(glbUrl);
  if (!response.ok) {
    throw new Error(`Failed to download GLB: ${response.statusText}`);
  }

  const fileStream = fs.createWriteStream(outputPath);
  const buffer = await response.arrayBuffer();
  
  return new Promise((resolve, reject) => {
    fileStream.write(Buffer.from(buffer));
    fileStream.end();
    fileStream.on('finish', () => {
      console.log(`✔ Saved GLB → ${outputPath}`);
      resolve(outputPath);
    });
    fileStream.on('error', reject);
  });
}

module.exports = {
  submitToMeshy,
  pollTaskStatus,
  downloadGlbFile,
};
