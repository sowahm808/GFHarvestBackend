const { admin } = require('../config/firebase');
const { createChildAccount } = require('../services/childAccountService');

exports.register = async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: 'email, password, name, and role are required' });
  }
  try {
    const userRecord = await admin
      .auth()
      .createUser({ email, password, displayName: name });
    await admin
      .auth()
      .setCustomUserClaims(userRecord.uid, { role: 'pending', requestedRole: role });
    res
      .status(201)
      .json({ uid: userRecord.uid, email: userRecord.email, requestedRole: role });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.registerParent = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userRecord = await admin
      .auth()
      .createUser({ email, password, displayName: name });
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
    const userRecord = await admin
      .auth()
      .createUser({ email, password, displayName: name });
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

exports.assignRole = async (req, res) => {
  const { uid, role } = req.body;
  const allowed = ['mentor', 'child', 'parent'];
  if (!uid || !role) {
    return res.status(400).json({ message: 'uid and role are required' });
  }
  if (!allowed.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    res.json({ uid, role });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const result = await admin.auth().listUsers();
    const users = result.users.map((u) => ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      role: u.customClaims?.role || null,
    }));
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.listPendingUsers = async (req, res) => {
  try {
    const result = await admin.auth().listUsers();
    const pending = result.users
      .filter((u) => u.customClaims?.role === 'pending')
      .map((u) => ({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        requestedRole: u.customClaims?.requestedRole || null,
      }));
    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.approveUser = async (req, res) => {
  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ message: 'uid is required' });
  }
  try {
    const user = await admin.auth().getUser(uid);
    const requestedRole = user.customClaims?.requestedRole;
    if (!requestedRole) {
      return res.status(400).json({ message: 'No requested role found' });
    }
    await admin.auth().setCustomUserClaims(uid, { role: requestedRole });
    res.json({ uid, role: requestedRole });
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
