// config/firebase.js
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let firebaseServices = {};

if (process.env.NODE_ENV !== 'test') {
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!serviceAccountPath) {
    throw new Error(
      'GOOGLE_APPLICATION_CREDENTIALS is not set. Create a .env file and specify your Firebase key path.'
    );
  }

  const resolvedPath = path.resolve(serviceAccountPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Firebase service account file not found at: ${resolvedPath}`);
  }

  const serviceAccount = require(resolvedPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  firebaseServices = {
    auth: admin.auth(),
    firestore: admin.firestore(),
    messaging: admin.messaging?.(),
    storage: admin.storage?.()
  };
}

module.exports = {
  admin,
  ...firebaseServices
};
