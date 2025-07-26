const { admin, firestore } = require('../config/firebase');
const db = firestore;

exports.createRecord = async (req, res) => {
  const { childId, mentorId, notes, progress, dueDate } = req.body;
  try {
    const data = {
      childId,
      mentorId,
      notes,
      progress,
      dueDate: dueDate ? new Date(dueDate) : null,
      created: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await db.collection('mentorRecords').add(data);
    res.status(201).json({ message: 'Record saved', id: docRef.id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getRecords = async (req, res) => {
  const { childId } = req.params;
  try {
    const snapshot = await db
      .collection('mentorRecords')
      .where('childId', '==', childId)
      .orderBy('created', 'desc')
      .get();
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
