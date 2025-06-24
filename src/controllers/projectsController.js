const admin = require('../config/firebase');
const db = admin.firestore();

exports.upsertProject = async (req, res) => {
  const { projectId, childId, title, progress } = req.body;
  try {
    const data = {
      childId,
      title,
      progress,
      updated: admin.firestore.FieldValue.serverTimestamp(),
    };
    let id = projectId;
    if (projectId) {
      await db.collection('projects').doc(projectId).set(data, { merge: true });
    } else {
      const docRef = await db.collection('projects').add(data);
      id = docRef.id;
    }
    res.status(201).json({ message: 'Project saved', id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getProjects = async (req, res) => {
  const { childId } = req.params;
  try {
    const snapshot = await db
      .collection('projects')
      .where('childId', '==', childId)
      .orderBy('updated', 'desc')
      .get();
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
