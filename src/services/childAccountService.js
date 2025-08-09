const { admin, firestore } = require('../config/firebase');
const db = firestore;

/**
 * Creates a child account using Firebase Admin SDK and stores profile data.
 * This should be called from a privileged environment so that the parent
 * remains signed in on the client.
 * @param {Object} params
 * @param {string} params.email - Child's email
 * @param {string} params.password - Child's password
 * @param {string} params.name - Child's display name
 * @param {number} params.age - Child's age
 * @param {string} params.parentId - UID of the parent creating the child
 * @returns {Promise<admin.auth.UserRecord>} The created Firebase user record
 */
async function createChildAccount({ email, password, name, age, parentId }) {
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: name,
  });
  await admin.auth().setCustomUserClaims(userRecord.uid, {
    role: 'child',
    parentId,
  });
  if (db) {
    await db.collection('children').doc(userRecord.uid).set({ name, age, parentId });
  }
  return userRecord;
}

module.exports = { createChildAccount };
