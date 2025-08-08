// controllers/mentorsController.js
const { firestore } = require('../config/firebase');

exports.createMentor = async (req, res) => {
  const { name, email, phone } = req.body || {};
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'name, email, phone are required' });
  }

  try {
    const doc = await firestore.collection('mentors').add({ name, email, phone });
    return res.status(201).json({ id: doc.id, name, email, phone });
  } catch (err) {
    console.error('createMentor error:', err);
    return res.status(500).json({ message: 'Failed to create mentor' });
  }
};

exports.listMentors = async (_req, res) => {
  try {
    const snap = await firestore.collection('mentors').get();
    const mentors = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(mentors);
  } catch (err) {
    console.error('listMentors error:', err);
    return res.status(500).json({ message: 'Failed to list mentors' });
  }
};

exports.assignMentor = async (req, res) => {
  const { mentorId, childId } = req.body || {};
  if (!mentorId || !childId) {
    return res.status(400).json({ message: 'mentorId and childId are required' });
  }
  try {
    await firestore.collection('mentorAssignments').add({ mentorId, childId });
    return res.status(201).json({ message: 'Mentor assigned' });
  } catch (err) {
    console.error('assignMentor error:', err);
    return res.status(500).json({ message: 'Failed to assign mentor' });
  }
};

exports.getChildren = async (req, res) => {
  const { mentorId } = req.params;
  try {
    const snap = await firestore
      .collection('mentorAssignments')
      .where('mentorId', '==', mentorId)
      .get();
    const children = snap.docs.map(d => d.data().childId);
    return res.json({ children });
  } catch (err) {
    console.error('getChildren error:', err);
    return res.status(500).json({ message: 'Failed to fetch children' });
  }
};
