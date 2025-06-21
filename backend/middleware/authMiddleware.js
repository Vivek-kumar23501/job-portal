const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole)
      return res.status(403).json({ msg: "Access denied: wrong role" });
    next();
  };
};

module.exports = { authenticate, checkRole };
