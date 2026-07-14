// Using Node.js built-in global fetch

/**
 * Provider implementation for YouCam / Perfect Corp API
 */
const generateTryOn = async (userImageUrl, sareeImageUrl) => {
  console.log(`[YOUCAM] Starting Virtual Try-On task...`);
  
  if (!process.env.YOUCAM_API_KEY) {
    throw new Error('YOUCAM_API_KEY is not defined in environment variables.');
  }
  
  const apiKey = process.env.YOUCAM_API_KEY;
  const startTime = Date.now();
  let taskId;
  
  // 1. Create AI Task
  console.log(`[YOUCAM] Triggering POST /s2s/v2.0/task/cloth`);
  try {
    const taskRes = await fetch('https://yce-api-01.makeupar.com/s2s/v2.0/task/cloth', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        src_file_url: userImageUrl,
        ref_file_url: sareeImageUrl,
        garment_category: 'full_body' // Changed from upper_body to correctly drape sarees over the full body
      })
    });
    
    const taskData = await taskRes.json();
    
    if (taskRes.status !== 200 || !taskData.data || !taskData.data.task_id) {
      if (taskRes.status === 401 || taskRes.status === 403) {
        throw new Error(`Authentication Failed (401/403). Invalid API Key.`);
      }
      if (taskRes.status === 429) {
        throw new Error(`Rate Limit Exceeded (429).`);
      }
      throw new Error(`Failed to create task. Status: ${taskRes.status}. Details: ${JSON.stringify(taskData)}`);
    }
    
    taskId = taskData.data.task_id;
    console.log(`[YOUCAM] Task Created successfully. Task ID: ${taskId}`);
  } catch (error) {
    console.error(`[YOUCAM] Error creating task:`, error.message);
    throw new Error(`YouCam API Failure: ${error.message}`);
  }
  
  // 2. Poll for Status
  console.log(`[YOUCAM] Polling for task completion...`);
  let generatedImageUrl = null;
  const maxRetries = 40; // 40 * 3 seconds = 120 seconds max polling
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    await new Promise(r => setTimeout(r, 3000));
    retryCount++;
    
    try {
      const pollRes = await fetch(`https://yce-api-01.makeupar.com/s2s/v2.0/task/cloth/${taskId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      
      const pollData = await pollRes.json();
      
      if (!pollData.data) {
        throw new Error(`Malformed polling response: ${JSON.stringify(pollData)}`);
      }
      
      const status = pollData.data.task_status;
      
      if (status === 'success') {
        if (pollData.data.results && pollData.data.results.url) {
          generatedImageUrl = pollData.data.results.url;
          console.log(`[YOUCAM] Generation successful! Retrieved image URL.`);
          break;
        } else {
          throw new Error('Task success but no results.url found in payload.');
        }
      } else if (status === 'error') {
        throw new Error(`Task returned error status: ${pollData.data.error_message || pollData.data.error || 'Unknown Error'}`);
      }
      
      // If status is 'pending', 'processing', or 'running', we continue polling
      console.log(`[YOUCAM] Task status: ${status}. Waiting...`);
    } catch (error) {
       console.error(`[YOUCAM] Error during polling:`, error.message);
       throw new Error(`YouCam Polling Failure: ${error.message}`);
    }
  }
  
  if (!generatedImageUrl) {
    throw new Error(`YouCam generation timed out after ${maxRetries * 3} seconds.`);
  }
  
  const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`[YOUCAM] Pipeline Completed Successfully in ${generationTime}s.`);
  
  return {
    generatedImageUrl,
    modelUsed: 'youcam/v2.0',
    generationTimeSeconds: generationTime
  };
};

module.exports = {
  generateTryOn
};
