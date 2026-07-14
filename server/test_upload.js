const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  try {
    // Create a dummy 1x1 jpeg image
    const dummyImage = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');
    fs.writeFileSync('dummy.jpg', dummyImage);

    const form = new FormData();
    form.append('userImage', fs.createReadStream('dummy.jpg'));
    form.append('sareeImageUrl', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c');

    const response = await axios.post('http://localhost:5000/api/tryon', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
  }
}

testUpload();
