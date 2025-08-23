const { firestore } = require('../config/firebase');
const db = firestore;

exports.addRequest = async (req, res) => {
  const { userId, text } = req.body;
  if (!userId || !text) {
    return res.status(400).json({ message: 'userId and text are required' });
  }
  try {
    const docRef = await db.collection('prayerRequests').add({
      userId,
      text,
      createdAt: new Date().toISOString(),
      prayedAt: null,
    });
    res.status(201).json({ id: docRef.id, userId, text });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.listRequests = async (req, res) => {
  try {
    const snapshot = await db.collection('prayerRequests').get();
    const requests = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.markPrayed = async (req, res) => {
  const { id } = req.params;
  const timestamp = new Date().toISOString();
  try {
    await db.collection('prayerRequests').doc(id).update({ prayedAt: timestamp });
    res.json({ id, prayedAt: timestamp });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
