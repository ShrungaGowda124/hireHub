
const checkRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      let userRole = req.user?.role;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).send("Access denied");
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ ERROR: err.message });
    }
  };
};

module.exports = checkRole;
