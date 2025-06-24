const admin = require('../config/firebase');
const db = admin.firestore();

const { sendBullyingAlert } = require('../services/notificationService');

exports.submitEntry = async (req, res) => {
  const { childId, status, notes, bullied } = req.body;
  try {
    const entry = {
      childId,
      status,
      notes,
      bullied: !!bullied,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection('mentalStatus').add(entry);
    if (bullied) {
      await sendBullyingAlert(childId, notes);
    }
    res.status(201).json({ message: 'Entry recorded' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getEntries = async (req, res) => {
  const { childId } = req.params;
  try {
    const snapshot = await db
      .collection('mentalStatus')
      .where('childId', '==', childId)
      .orderBy('timestamp', 'desc')
      .get();
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
