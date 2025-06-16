function roleGuard(roles = []) {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = roleGuard;
