const { firestore } = require('../config/firebase');
const db = firestore;

async function run() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const snapshot = await db
    .collection('prayerRequests')
    .where('prayedAt', '!=', null)
    .get();
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.prayedAt && new Date(data.prayedAt) < sevenDaysAgo) {
      await doc.ref.delete();
    }
  }
}

run()
  .then(() => console.log('Prayer request cleanup complete'))
  .catch((err) => console.error(err));
