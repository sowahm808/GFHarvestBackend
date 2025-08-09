// config/firebase.js
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let firebaseServices = {};

if (process.env.NODE_ENV !== 'test') {
  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    try {
      serviceAccount = JSON.parse(raw);
    } catch (jsonErr) {
      try {
        const decoded = Buffer.from(raw, 'base64').toString('utf8');
        serviceAccount = JSON.parse(decoded);
      } catch (decodeErr) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT is not valid JSON or base64-encoded JSON');
      }
    }
  } else {
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!serviceAccountPath) {
      throw new Error(
        'Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS to configure Firebase'
      );
    }

    const resolvedPath = path.resolve(serviceAccountPath);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Firebase service account file not found at: ${resolvedPath}`);
    }
    serviceAccount = require(resolvedPath);
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
