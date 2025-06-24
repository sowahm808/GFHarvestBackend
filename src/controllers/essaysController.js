const { admin, firestore } = require('../config/firebase');
const db = firestore;

exports.createOrUpdate = async (req, res) => {
  const { childId, status } = req.body;
  try {
    const entry = {
      childId,
      status,
      updated: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection('essays').doc(childId).set(entry, { merge: true });
    res.status(201).json({ message: 'Essay status updated' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getProgress = async (req, res) => {
  const { childId } = req.params;
  try {
    const doc = await db.collection('essays').doc(childId).get();
    if (!doc.exists) {
      return res.json(null);
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
