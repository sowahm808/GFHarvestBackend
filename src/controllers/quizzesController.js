const { admin, firestore } = require('../config/firebase');
const db = firestore;

exports.getTodayQuiz = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const doc = await db.collection('quizzes').doc(today).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  const { childId, quizId, answers } = req.body;
  try {
    const entry = {
      childId,
      quizId,
      answers,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection('quizSubmissions').add(entry);
    res.status(201).json({ message: 'Quiz submitted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getHistory = async (req, res) => {
  const { childId } = req.params;
  try {
    const snapshot = await db
      .collection('quizSubmissions')
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
