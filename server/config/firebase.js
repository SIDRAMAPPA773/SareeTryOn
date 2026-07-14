const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let firebaseInitialized = false;

try {
  const credJson = process.env.FIREBASE_CRED_JSON;
  const credPath = process.env.FIREBASE_CREDENTIALS_PATH || path.join(__dirname, '../firebase-credentials.json');

  if (credJson) {
    const serviceAccount = JSON.parse(credJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized from env JSON');
  } else if (fs.existsSync(credPath)) {
    const serviceAccount = require(credPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseInitialized = true;
    console.log(`✅ Firebase Admin initialized from file: ${credPath}`);
  } else {
    console.warn('⚠️ Firebase credentials not found. Auth-dependent jewelry routes will be disabled.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
}

module.exports = {
  admin,
  isInitialized: () => firebaseInitialized
};
