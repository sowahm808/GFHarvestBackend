// scripts/setAdminClaim.js
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Point straight at your JSON (relative to this file)
const serviceAccountPath = path.resolve(__dirname, '../src/config/firebase-service-account.json');

// Sanity check so we fail nicely if path is wrong
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Service account file not found at:', serviceAccountPath);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  // projectId is inside the JSON, so we don't need to set it here
});

const uid = process.argv[2]; // Usage: node scripts/setAdminClaim.js <UID>
if (!uid) {
  console.error('Usage: node scripts/setAdminClaim.js <FIREBASE_UID>');
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Admin claim set for UID: ${uid}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error setting admin claim:', err && err.message || err);
    process.exit(1);
  });
