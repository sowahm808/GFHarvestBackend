const admin = require('../config/firebase');
const db = admin.firestore();

const MAX_MEMBERS = 5;

exports.createGroup = async (req, res) => {
  const { name, members = [] } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Group name required' });
  }
  if (members.length > MAX_MEMBERS) {
    return res.status(400).json({ message: `Group can have max ${MAX_MEMBERS} members` });
  }
  try {
    const docRef = await db.collection('groups').add({ name, members });
    res.status(201).json({ id: docRef.id, name, members });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.addMember = async (req, res) => {
  const { groupId, childId } = req.body;
  if (!groupId || !childId) {
    return res.status(400).json({ message: 'groupId and childId required' });
  }
  try {
    const docRef = db.collection('groups').doc(groupId);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Group not found' });
    }
    const data = doc.data();
    const members = data.members || [];
    if (members.includes(childId)) {
      return res.status(400).json({ message: 'Child already in group' });
    }
    if (members.length >= MAX_MEMBERS) {
      return res.status(400).json({ message: `Group can have max ${MAX_MEMBERS} members` });
    }
    members.push(childId);
    await docRef.update({ members });
    res.json({ id: groupId, name: data.name, members });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const doc = await db.collection('groups').doc(groupId).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.listGroups = async (req, res) => {
  try {
    const snapshot = await db.collection('groups').get();
    const groups = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

