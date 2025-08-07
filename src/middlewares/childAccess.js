const { admin } = require('../config/firebase');

/**
 * Middleware to ensure that the requester is either:
 * - the child referenced in the request
 * - the parent of that child
 * - OR (optional) an admin
 *
 * The childId may come from route param or request body.
 */
module.exports = async function childAccess(req, res, next) {
  const childId = req.params.childId || req.body.childId;

  if (!childId) {
    return res.status(400).json({ message: 'Missing required childId' });
  }

  const user = req.user;
  if (!user || !user.uid || !user.role) {
    return res.status(401).json({ message: 'Unauthorized: missing user info' });
  }

  const { uid, role } = user;

  // ✅ Allow child to access their own resources
  if (role === 'child' && uid === childId) {
    return next();
  }

  // ✅ Allow parent to access resources of their own child
  if (role === 'parent') {
    try {
      const userRecord = await admin.auth().getUser(childId);
      const claims = userRecord.customClaims || {};
      if (claims.parentId === uid) {
        return next();
      }
    } catch (err) {
      console.error('❌ Firebase getUser error in childAccess:', err.message);
      return res.status(500).json({ message: 'Error verifying child-parent link' });
    }
  }

  // ✅ (Optional) Allow admin override
  if (role === 'admin') {
    return next();
  }

  // ❌ All other cases forbidden
  return res.status(403).json({ message: 'Forbidden: access denied' });
};
