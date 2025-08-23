const { firestore } = require('../config/firebase');
const db = firestore;

exports.createChurch = async (req, res) => {
  const { name, logoUrl } = req.body;
  if (!name || !logoUrl) {
    return res.status(400).json({ message: 'name and logoUrl are required' });
  }
  try {
    const docRef = await db.collection('churches').add({
      name,
      logoUrl,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ id: docRef.id, name, logoUrl });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.listChurches = async (req, res) => {
  try {
    const snapshot = await db.collection('churches').get();
    const churches = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(churches);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
