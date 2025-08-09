const { admin } = require('../config/firebase');
const { createChildAccount } = require('../services/childAccountService');

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

exports.setAdminRole = async (req, res) => {
  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ message: 'uid is required' });
  }
  try {
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
    res.json({ uid, role: 'admin' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.addChild = async (req, res) => {
  const { email, password, name, age } = req.body;
  const parentId = req.user.uid;
  try {
    const userRecord = await createChildAccount({
      email,
      password,
      name,
      age,
      parentId,
    });
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
