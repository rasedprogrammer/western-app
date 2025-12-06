const jwt = require("jsonwebtoken");

const allowOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

const verifyToken = (req, res, next) => {
  try {
    const origin = req.headers.origin;
    if (origin && !allowOrigins.includes(origin)) {
      return res.status(403).json({ message: "Access Denied !" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized or Token Missing!!!" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or Expired Token!!!",
    });
  }
};

// Allow Admin
const isAdmin = (req, res, next) => {
  if (req.user?.userType === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access Denied!!!" });
};

// Employee and Admin Allow
const isAdminEmployee = (req, res, next) => {
  if (["admin", "employee"].includes(req.user?.userType)) {
    return next();
  }
  res.status(403).json({ message: "Access Denied!!!" });
};

// Employee and Admin And Customer Allow
const isAdminEmployeeCustomer = (req, res, next) => {
  if (["admin", "employee", "customer"].includes(req.user?.userType)) {
    return next();
  }
  res.status(403).json({ message: "Access Denied!!!" });
};

module.exports = {
  verifyToken,
  isAdmin,
  isAdminEmployee,
  isAdminEmployeeCustomer,
};
