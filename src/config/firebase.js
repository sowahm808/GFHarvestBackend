const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  throw new Error(
    'GOOGLE_APPLICATION_CREDENTIALS is not set. Did you copy .env.example to .env and set the path to your Firebase service account key?'
  );
}

const resolvedPath = path.resolve(serviceAccountPath);
if (!fs.existsSync(resolvedPath)) {
  throw new Error(`Service account file not found at: ${resolvedPath}`);
}

admin.initializeApp({
  credential: admin.credential.cert(require(resolvedPath)),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

module.exports = admin;
