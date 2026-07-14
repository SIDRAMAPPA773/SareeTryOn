const fs = require('fs');

async function testRaw() {
  try {
    const cloudName = 'do75leapx';
    const apiKey = '253243596555423';
    const apiSecret = '7spGKlx1-05dyin-XDEWujhiMi4';
    
    // 1x1 dummy jpeg base64
    const base64Data = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
    const buffer = Buffer.from(base64Data, 'base64');
    
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureString = `timestamp=${timestamp}${apiSecret}`;
    const crypto = require('crypto');
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="api_key"\r\n\r\n${apiKey}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="signature"\r\n\r\n${signature}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="file"; filename="dummy.jpg"\r\n`;
    body += `Content-Type: image/jpeg\r\n\r\n`;
    
    const payload = Buffer.concat([
      Buffer.from(body, 'utf8'),
      buffer,
      Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
    ]);

    console.log("Sending raw request to Cloudinary...");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: payload
    });

    const text = await res.text();
    console.log('Response Status:', res.status);
    console.log('Raw Response Body:', text.substring(0, 500));
  } catch(e) {
    console.error("Fetch Error:", e);
  }
}
testRaw();
