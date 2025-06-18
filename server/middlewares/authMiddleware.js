const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

// ตรวจสอบ token และแนบ user object จาก DB
async function verifyAndAttachUser(req, res) {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    res.status(401).json({ message: "Unauthorized. Token not found." });
    return null;
  }
  const token = headerToken.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401).json({ message: "Unauthorized. Invalid token." });
    return null;
  }
  if (!decodedToken || !decodedToken.userId) {
    res.status(401).json({ message: "Unauthorized. Invalid token structure." });
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { userId: decodedToken.userId },
  });
  if (!user) {
    res.status(401).json({ message: "Unauthorized. User not found." });
    return null;
  }
  req.user = user;
  return user;
}

// Middleware: แค่ตรวจสอบ token (ไม่เช็ค role)
exports.authCheckNormal = async (req, res, next) => {
  try {
    const user = await verifyAndAttachUser(req, res);
    if (!user) return;
    next();
  } catch (error) {
    console.error("authCheckNormal error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Middleware: เฉพาะ user, admin, technician
exports.authCheckUser = async (req, res, next) => {
  try {
    const user = await verifyAndAttachUser(req, res);
    if (!user) return;
    if (!["user", "admin", "technician"].includes(user.role.toLowerCase())) {
      return res.status(403).json({ message: "Forbidden: User access only" });
    }
    next();
  } catch (error) {
    console.error("authCheckUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware: เฉพาะ admin
exports.authCheckAdmin = async (req, res, next) => {
  try {
    const user = await verifyAndAttachUser(req, res);
    if (!user) return;
    if (user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }
    next();
  } catch (error) {
    console.error("authCheckAdmin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware: เฉพาะ technician
exports.authCheckTechnician = async (req, res, next) => {
  try {
    const user = await verifyAndAttachUser(req, res);
    if (!user) return;
    if (user.role.toLowerCase() !== "technician") {
      return res.status(403).json({ message: "Forbidden: Technician only" });
    }
    next();
  } catch (error) {
    console.error("authCheckTechnician error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};