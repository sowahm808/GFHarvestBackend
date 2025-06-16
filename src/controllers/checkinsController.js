const admin = require('../config/firebase');

const db = admin.firestore();

exports.submitCheckin = async (req, res) => {
  const { childId, mood, notes } = req.body;
  try {
    const entry = { childId, mood, notes, timestamp: admin.firestore.FieldValue.serverTimestamp() };
    await db.collection('checkins').add(entry);
    res.status(201).json({ message: 'Check-in submitted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getCheckins = async (req, res) => {
  const { childId } = req.params;
  try {
    const snapshot = await db.collection('checkins').where('childId', '==', childId).orderBy('timestamp', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
