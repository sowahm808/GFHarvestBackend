const admin = require('../config/firebase');
const db = admin.firestore();

exports.grantPoints = async (req, res) => {
  const { childId, amount, activity, fromParent } = req.body;
  try {
    const entry = {
      childId,
      amount,
      activity,
      fromParent: !!fromParent,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection('points').add(entry);
    res.status(201).json({ message: 'Points granted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

async function getChildTotal(childId) {
  const snapshot = await db
    .collection('points')
    .where('childId', '==', childId)
    .get();
  return snapshot.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0);
}

exports.getChildPoints = async (req, res) => {
  const { childId } = req.params;
  try {
    const total = await getChildTotal(childId);
    res.json({ childId, total });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getGroupPoints = async (req, res) => {
  const { groupId } = req.params;
  try {
    const groupDoc = await db.collection('groups').doc(groupId).get();
    if (!groupDoc.exists) {
      return res.status(404).json({ message: 'Group not found' });
    }
    const { members = [] } = groupDoc.data();
    let total = 0;
    for (const childId of members) {
      total += await getChildTotal(childId);
    }
    res.json({ groupId, total });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
