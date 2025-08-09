function roleGuard(roles = []) {
  if (!Array.isArray(roles)) roles = [roles];

  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    // Superuser bypass: if token has admin: true, allow everything
    if (user.claims?.admin === true) return next();

    if (!user.role || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
module.exports = roleGuard;
