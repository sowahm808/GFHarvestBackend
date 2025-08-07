// scripts/setAdminClaim.js
require('dotenv').config();
const { admin } = require('../config/firebase');

const uid = process.argv[2]; // Pass UID as command-line arg

if (!uid) {
  console.error('❌ Please provide a Firebase UID:');
  console.error('   node scripts/setAdminClaim.js <USER_UID>');
  process.exit(1);
}

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Successfully assigned admin role to UID: ${uid}`);
  })
  .catch((err) => {
    console.error('❌ Error assigning admin role:', err.message);
  });
