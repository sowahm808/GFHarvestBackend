const { firestore } = require('../config/firebase');
const db = firestore;

exports.createMentor = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const docRef = await db.collection('mentors').add({ name, email, phone });
    res.status(201).json({ id: docRef.id, name, email, phone });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.assignMentor = async (req, res) => {
  const { mentorId, childId } = req.body;
  try {
    await db.collection('mentorAssignments').add({ mentorId, childId });
    res.status(201).json({ message: 'Mentor assigned' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getChildren = async (req, res) => {
  const { mentorId } = req.params;
  try {
    const snapshot = await db
      .collection('mentorAssignments')
      .where('mentorId', '==', mentorId)
      .get();
    const children = snapshot.docs.map((d) => d.data().childId);
    res.json(children);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
