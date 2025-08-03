const { admin } = require('../config/firebase');

// Middleware to ensure that the requester is either the child
// referenced in the request or the parent of that child.
// childId may be provided as a route param or in the request body.
module.exports = async function childAccess(req, res, next) {
  const childId = req.params.childId || req.body.childId;
  if (!childId) {
    return res.status(400).json({ message: 'childId required' });
  }

  const { role, uid } = req.user || {};

  // Allow a child to access their own resources
  if (role === 'child') {
    if (uid === childId) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Allow a parent to access resources of their own child
  if (role === 'parent') {
    try {
      const userRecord = await admin.auth().getUser(childId);
      const claims = userRecord.customClaims || {};
      if (claims.parentId === uid) {
        return next();
      }
    } catch (err) {
      console.error('childAccess error', err);
      return res.status(400).json({ message: err.message });
    }
  }

  return res.status(403).json({ message: 'Forbidden' });
};
