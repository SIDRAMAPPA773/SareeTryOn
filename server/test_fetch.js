const fs = require('fs');

async function test() {
  try {
    const base64Data = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
    const buffer = Buffer.from(base64Data, 'base64');
    
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="sareeImageUrl"\r\n\r\n`;
    body += `https://images.unsplash.com/photo-1610030469983-98e550d6193c\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="userImage"; filename="dummy.jpg"\r\n`;
    body += `Content-Type: image/jpeg\r\n\r\n`;
    
    const payload = Buffer.concat([
      Buffer.from(body, 'utf8'),
      buffer,
      Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
    ]);

    const res = await fetch('http://localhost:5000/api/tryon', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: payload
    });

    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Data:', data);
  } catch(e) {
    console.error(e);
  }
}
test();
