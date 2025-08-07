const { firestore } = require('../config/firebase');

// Add a parent-child link
exports.linkParentChild = async (req, res) => {
  const { parentId, childId } = req.body;

  if (!parentId || !childId) {
    return res.status(400).json({ message: 'parentId and childId required' });
  }

  try {
    // Check if link already exists
    const existing = await firestore
      .collection('parentChildLinks')
      .where('parentId', '==', parentId)
      .where('childId', '==', childId)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(400).json({ message: 'Link already exists' });
    }

    await firestore.collection('parentChildLinks').add({ parentId, childId });
    res.status(201).json({ message: 'Link created' });
  } catch (err) {
    console.error('Error creating link:', err);
    res.status(500).json({ message: 'Internal error' });
  }
};

// Remove a link
exports.unlinkParentChild = async (req, res) => {
  const { parentId, childId } = req.body;

  if (!parentId || !childId) {
    return res.status(400).json({ message: 'parentId and childId required' });
  }

  try {
    const snapshot = await firestore
      .collection('parentChildLinks')
      .where('parentId', '==', parentId)
      .where('childId', '==', childId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Link not found' });
    }

    await snapshot.docs[0].ref.delete();
    res.json({ message: 'Link removed' });
  } catch (err) {
    console.error('Error removing link:', err);
    res.status(500).json({ message: 'Internal error' });
  }
};

// List all children linked to a parent
exports.getChildrenForParent = async (req, res) => {
  const { parentId } = req.params;
  if (!parentId) {
    return res.status(400).json({ message: 'parentId required' });
  }

  try {
    const snapshot = await firestore
      .collection('parentChildLinks')
      .where('parentId', '==', parentId)
      .get();

    const children = snapshot.docs.map(doc => doc.data().childId);
    res.json({ children });
  } catch (err) {
    console.error('Error fetching children:', err);
    res.status(500).json({ message: 'Internal error' });
  }
};
