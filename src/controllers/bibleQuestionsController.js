const { firestore } = require('../config/firebase');
const db = firestore;

exports.getQuestions = async (req, res) => {
  const { quarter } = req.query;
  try {
    let ref = db.collection('bibleQuestions');
    if (quarter) {
      ref = ref.where('quarter', '==', quarter);
    }
    const snapshot = await ref.get();
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await db.collection('bibleQuestions').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
