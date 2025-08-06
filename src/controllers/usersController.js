const { admin, firestore } = require('../config/firebase');
const db = firestore;

exports.registerParent = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName: name });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'parent' });
    res.status(201).json({ uid: userRecord.uid, email: userRecord.email });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.registerAdmin = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName: name });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
    res.status(201).json({ uid: userRecord.uid, email: userRecord.email });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.addChild = async (req, res) => {
  const { email, password, name, age } = req.body;
  const parentId = req.user.uid;
  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName: name });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'child', parentId });
    if (db) {
      await db.collection('children').doc(userRecord.uid).set({ name, age, parentId });
    }
    res.status(201).json({ uid: userRecord.uid, email: userRecord.email });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    res.json({ uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName, role: req.user.role });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
