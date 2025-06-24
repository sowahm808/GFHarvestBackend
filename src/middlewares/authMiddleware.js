const admin = require('../config/firebase');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No auth token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    // get custom claims in case the token doesn't include them yet
    const userRecord = await admin.auth().getUser(decoded.uid);
    req.user = { ...decoded, ...userRecord.customClaims };
    next();
  } catch (err) {
    console.error('Auth error', err);
    res.status(401).json({ message: 'Invalid auth token' });
  }
}

module.exports = authMiddleware;
