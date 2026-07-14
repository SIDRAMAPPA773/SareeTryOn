const { spawn } = require('child_process');
const path = require('path');

/**
 * Runs the Python preprocessing script on the input image.
 * Returns the base64 data URI of the preprocessed image.
 */
function preprocessImage(imagePath, removeBg = true) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../scripts/preprocess.py');
    const pythonProcess = spawn('python', [scriptPath, imagePath, removeBg ? '1' : '0']);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python preprocessing failed with code ${code}. Stderr: ${stderrData}`);
        reject(new Error(`Image preprocessing failed: ${stderrData.trim()}`));
      } else {
        resolve(stdoutData.trim());
      }
    });

    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python preprocessing process:', err);
      reject(err);
    });
  });
}

module.exports = {
  preprocessImage
};
