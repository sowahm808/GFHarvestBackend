// config/firebase.js
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let firebaseServices = {};

if (process.env.NODE_ENV !== 'test') {
  let serviceAccount = null;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // In Render: Parse JSON from environment variable
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // In local dev: Load from local file
    const resolvedPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Firebase service account file not found at: ${resolvedPath}`);
    }
    serviceAccount = require(resolvedPath);
  } else {
    throw new Error('Neither FIREBASE_SERVICE_ACCOUNT nor GOOGLE_APPLICATION_CREDENTIALS is set');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  firebaseServices = {
    auth: admin.auth(),
    firestore: admin.firestore(),
    messaging: admin.messaging?.(),
    storage: admin.storage?.(),
  };
}

module.exports = {
  admin,
  ...firebaseServices
};
