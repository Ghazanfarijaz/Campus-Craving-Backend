// middlewares/roles.middleware.js
const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Role ${req.user.role} is not allowed`,
      });
    }
    next();
  };
};

module.exports = restrictTo;
