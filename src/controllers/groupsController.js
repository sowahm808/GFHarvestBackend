const { firestore, admin } = require('../config/firebase');
const db = firestore;

const MAX_MEMBERS = 5;
const GROUP_TYPES = ['school', 'neighbourhood', 'family', 'church', 'random'];

// Create a new group
exports.createGroup = async (req, res) => {
  const { name, type, ageGroup, members = [], mentorId = null } = req.body;
  if (!name) return res.status(400).json({ message: 'Group name required' });
  if (!type || !GROUP_TYPES.includes(type)) return res.status(400).json({ message: 'Valid group type required' });
  if (!ageGroup) return res.status(400).json({ message: 'Age group required' });
  if (members.length > MAX_MEMBERS) return res.status(400).json({ message: `Group can have max ${MAX_MEMBERS} members` });

  try {
    const docRef = await db.collection('groups').add({
      name,
      type,
      ageGroup,
      members,
      mentorId,
      createdBy: req.user.uid,
      created: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(201).json({ id: docRef.id, name, type, ageGroup, members, mentorId });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Add a child to a group
exports.addMember = async (req, res) => {
  const { groupId, childId } = req.body;
  if (!groupId || !childId) return res.status(400).json({ message: 'groupId and childId required' });

  try {
    const groupRef = db.collection('groups').doc(groupId);
    const groupDoc = await groupRef.get();
    if (!groupDoc.exists) return res.status(404).json({ message: 'Group not found' });

    const groupData = groupDoc.data();
    const members = groupData.members || [];

    if (members.includes(childId)) return res.status(400).json({ message: 'Child already in group' });
    if (members.length >= MAX_MEMBERS) return res.status(400).json({ message: `Group can have max ${MAX_MEMBERS} members` });

    // Optional: Match age group (requires ageGroup in child profile)
    const childDoc = await db.collection('children').doc(childId).get();
    if (!childDoc.exists) return res.status(404).json({ message: 'Child not found' });

    const childAgeGroup = childDoc.data().ageGroup;
    if (childAgeGroup !== groupData.ageGroup) {
      return res.status(400).json({ message: 'Child age group does not match group age group' });
    }

    members.push(childId);
    await groupRef.update({ members });

    res.json({ message: 'Child added to group', id: groupId, name: groupData.name, members });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Assign or update a group's mentor
exports.assignMentor = async (req, res) => {
  const { groupId, mentorId } = req.body;
  if (!groupId || !mentorId) return res.status(400).json({ message: 'groupId and mentorId required' });

  try {
    const groupRef = db.collection('groups').doc(groupId);
    const doc = await groupRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Group not found' });

    await groupRef.update({ mentorId });
    res.json({ message: 'Mentor assigned to group', groupId, mentorId });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Get one group by ID
exports.getGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const doc = await db.collection('groups').doc(groupId).get();
    if (!doc.exists) return res.status(404).json({ message: 'Group not found' });

    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Get all groups (optionally filter by type and ageGroup)
exports.listGroups = async (req, res) => {
  const { type, ageGroup } = req.query;

  try {
    let query = db.collection('groups');
    if (type) query = query.where('type', '==', type);
    if (ageGroup) query = query.where('ageGroup', '==', ageGroup);

    const snapshot = await query.get();
    const groups = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Get groups a child belongs to
exports.getGroupsForChild = async (req, res) => {
  const { childId } = req.params;
  try {
    const snapshot = await db.collection('groups').where('members', 'array-contains', childId).get();
    const groups = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
