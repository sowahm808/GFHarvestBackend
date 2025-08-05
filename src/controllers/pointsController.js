const { admin, firestore } = require('../config/firebase');
const db = firestore;

exports.grantPoints = async (req, res) => {
  const { childId, activity, fromParent } = req.body;
  const amount = req.body.amount ?? req.body.points;

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
  return snapshot.docs.reduce((sum, d) => {
    const data = d.data();
    return sum + (data.amount ?? data.points ?? 0);
  }, 0);
}

exports.getChildPoints = async (req, res) => {
  const { childId } = req.params;
  try {
    const total = await getChildTotal(childId);
    res.json({ childId, points: total });
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

exports.listGroupPoints = async (_req, res) => {
  try {
    const groupsSnap = await db.collection('groups').get();
    const results = [];

    for (const doc of groupsSnap.docs) {
      const { members = [], name } = doc.data();
      let total = 0;
      for (const childId of members) {
        total += await getChildTotal(childId);
      }
      results.push({ groupId: doc.id, name, total });
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.streamChildPoints = (req, res) => {
  const { childId } = req.params;

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  const query = db.collection('points').where('childId', '==', childId);
  const unsubscribe = query.onSnapshot(
    async (snap) => {
      let total = 0;
      for (const doc of snap.docs) {
        const data = doc.data();
        total += data.amount ?? data.points ?? 0;
      }
      res.write(`data: ${JSON.stringify({ childId, points: total })}\n\n`);
    },
    (error) => {
      console.error('points stream error', error);
      res.write(`event: error\ndata: ${error.message}\n\n`);
    }
  );

  req.on('close', () => {
    unsubscribe();
    res.end();
  });
};
