const admin = require('../config/firebase');
const { sendReminder } = require('../services/notificationService');

async function sendQuizReminder(parentId) {
  await sendReminder(parentId, 'Remember to complete today\'s Bible quiz.');
}

async function sendEssayReminder(parentId) {
  await sendReminder(parentId, 'Check on your child\'s essay progress.');
}

async function sendProjectReminder(parentId) {
  await sendReminder(parentId, 'Project deadline is approaching.');
}

async function run() {
  const parents = await admin
    .auth()
    .listUsers()
    .then((list) => list.users.filter((u) => u.customClaims && u.customClaims.role === 'parent'));

  for (const parent of parents) {
    await sendQuizReminder(parent.uid);
    await sendEssayReminder(parent.uid);
    await sendProjectReminder(parent.uid);
  }
}

run().then(() => console.log('Reminder jobs complete')).catch(console.error);
