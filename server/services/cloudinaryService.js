const cloudinary = require('../config/cloudinary');

/**
 * Uploads an image buffer to Cloudinary
 * @param {Buffer} buffer - The image buffer
 * @param {String} folderName - The Cloudinary folder to store the image
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const fs = require('fs');
const crypto = require('crypto');

const uploadImageFile = async (filePath, folderName = 'saree_try_on') => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Missing Cloudinary credentials in .env");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    
    // Generate Cloudinary Signature
    // Signature format: SHA1(timestamp=<timestamp><apiSecret>)
    // If folder was passed, it would be: SHA1(folder=<folderName>&timestamp=<timestamp><apiSecret>)
    // But we removed folder earlier due to strict account settings, so we just sign timestamp.
    const signatureString = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    // Read the file from disk into a buffer
    const fileBuffer = fs.readFileSync(filePath);
    const boundary = '----WebKitFormBoundary' + crypto.randomBytes(8).toString('hex');

    // Construct the multipart/form-data body manually because Node 18 native FormData with Files can be finicky without external polyfills
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="api_key"\r\n\r\n${apiKey}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="signature"\r\n\r\n${signature}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="file"; filename="upload.jpg"\r\n`;
    body += `Content-Type: image/jpeg\r\n\r\n`;

    const payload = Buffer.concat([
      Buffer.from(body, 'utf8'),
      fileBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
    ]);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: payload
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error ? data.error.message : 'Unknown REST API Error';
      throw new Error(`Cloudinary REST Error: ${errMsg} (Status ${response.status})`);
    }

    return data;
  } catch (error) {
    console.error("Cloudinary Upload Error:");
    console.error(error);
    throw error;
  }
};

/**
 * Uploads an image from a URL to Cloudinary
 * @param {String} imageUrl - The remote URL to upload
 * @param {String} folderName - The Cloudinary folder
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadImageUrl = async (imageUrl, folderName = 'saree_try_on') => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folderName,
      resource_type: 'image',
    });
    return result;
  } catch (error) {
    console.error('Cloudinary URL upload error:', error);
    throw new Error('Failed to upload remote image to Cloudinary');
  }
};

module.exports = {
  uploadImageFile,
  uploadImageUrl,
};
