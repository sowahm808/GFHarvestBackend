const { admin, firestore } = require('../config/firebase');
const db = firestore;

exports.getChildProfile = async (req, res) => {
  const { childId } = req.params;
  try {
    const userRecord = await admin.auth().getUser(childId);
    const mentorSnapshot = await db
      .collection('mentorAssignments')
      .where('childId', '==', childId)
      .get();
    const mentors = mentorSnapshot.docs.map((d) => d.data().mentorId);

    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      mentors,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
