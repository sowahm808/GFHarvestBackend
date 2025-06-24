const admin = require('../config/firebase');
const db = admin.firestore();
const { sendWeeklySummary } = require('../services/notificationService');

async function buildSummary(parentId) {
  const children = await admin
    .auth()
    .listUsers()
    .then((list) =>
      list.users.filter((u) => u.customClaims && u.customClaims.parentId === parentId)
    );

  const lines = [];
  for (const child of children) {
    lines.push(`Summary for ${child.displayName}`);
    const checkinsSnap = await db
      .collection('checkins')
      .where('childId', '==', child.uid)
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();
    lines.push(`Check-ins: ${checkinsSnap.size}`);
  }
  return lines.join('\n');
}

async function run() {
  const parents = await admin
    .auth()
    .listUsers()
    .then((list) => list.users.filter((u) => u.customClaims && u.customClaims.role === 'parent'));

  for (const parent of parents) {
    const summary = await buildSummary(parent.uid);
    await sendWeeklySummary(parent.uid, summary);
  }
}

run().then(() => console.log('Weekly summary job complete')).catch(console.error);
