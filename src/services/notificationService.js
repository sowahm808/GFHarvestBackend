const { admin, firestore } = require('../config/firebase');
const db = firestore;

async function createNotification(userId, type, message) {
  const entry = {
    userId,
    type,
    message,
    read: false,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };
  await db.collection('notifications').add(entry);
}

exports.sendBullyingAlert = async function (childId, notes = '') {
  try {
    const child = await admin.auth().getUser(childId);
    const parentId = child.customClaims && child.customClaims.parentId;
    if (!parentId) {
      return;
    }
    const parent = await admin.auth().getUser(parentId);
    const message = `Possible bullying reported for ${child.displayName}. ${notes}`.trim();
    await createNotification(parentId, 'bullying', message);
    // Placeholder for email sending
    console.log(`Email to ${parent.email}: ${message}`);
  } catch (err) {
    console.error('Bullying alert error', err);
  }
};

exports.sendWeeklySummary = async function (parentId, summary) {
  try {
    const parent = await admin.auth().getUser(parentId);
    await createNotification(parentId, 'weeklySummary', summary);
    console.log(`Weekly summary email to ${parent.email}: ${summary}`);
  } catch (err) {
    console.error('Weekly summary error', err);
  }
};

exports.sendReminder = async function (parentId, message) {
  try {
    const parent = await admin.auth().getUser(parentId);
    await createNotification(parentId, 'reminder', message);
    console.log(`Reminder email to ${parent.email}: ${message}`);
  } catch (err) {
    console.error('Reminder error', err);
  }
};
