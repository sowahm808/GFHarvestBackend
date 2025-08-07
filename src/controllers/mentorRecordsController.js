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
  // A single endpoint is used by both parents and mentors to retrieve
  // mentoring records.  Parents request records for their children while
  // mentors request records that they have created.  Previously the handler
  // only looked for a `childId` parameter which meant requests made by
  // mentors (who supply their own user id) were not handled correctly by the
  // backend, resulting in 404 errors in the client.
  const { uid } = req.params; // uid can be either a childId or mentorId
  try {
    // Determine which field to filter on based on the caller's role. Parents
    // should receive records for their children, mentors should receive the
    // records they authored.
    const field = req.user && req.user.role === 'mentor' ? 'mentorId' : 'childId';
    const snapshot = await db
      .collection('mentorRecords')
      .where(field, '==', uid)
      .orderBy('created', 'desc')
      .get();
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
