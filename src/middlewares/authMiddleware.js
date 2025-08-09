const { admin } = require('../config/firebase');

module.exports = async function auth(req, res, next) {
  try {
    const authz = req.headers.authorization || '';
    const m = authz.match(/^Bearer\s+(.+)$/i);
    if (!m) return res.status(401).json({ message: 'Unauthorized' });

    const idToken = m[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Derive role from custom claims
    const claims = decoded || {};
    let role = claims.role; // optional if you set 'role' directly in claims

    // Backward-compatible mapping if you only set booleans:
    if (!role) {
      if (claims.admin === true) role = 'admin';
      else if (claims.parent === true) role = 'parent';
      else if (claims.mentor === true) role = 'mentor';
      else role = 'child'; // default fallback
    }

    req.user = {
      uid: decoded.uid,
      role,
      claims, // keep full claims for guards if needed
    };

    return next();
  } catch (err) {
    console.error('authMiddleware error:', err?.message || err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
