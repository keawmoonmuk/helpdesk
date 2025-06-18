const prisma = require("../config/prisma");

// ตรวจสอบสิทธิ์การเข้าถึง (เฉพาะ technician และ admin เท่านั้น)
const checkPermission = (role) => {
  return role === "technician" || role === "admin";
};

// รายงานสรุป
exports.summary = async (req, res) => {
  try {
    const { role } = req.user; // role มาจาก middleware authentication

    if (!checkPermission(role)) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึงรายงาน" });
    }

    const summaryData = await prisma.repairReport.findMany({
      select: {
        id: true,
        technician: { select: { name: true } },
        total_repairs: true,
        success_rate: true,
        createdAt: true,
      },
    });

    res.json(summaryData);
  } catch (error) {
    console.error("❌ summary Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

// รายงานสถิติ
exports.statistics = async (req, res) => {
  try {
    const { role } = req.user;

    if (!checkPermission(role)) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึงสถิติ" });
    }

    const statisticsData = await prisma.repairStatistics.findMany({
      select: {
        id: true,
        repair_type: true,
        total_repairs: true,
        average_duration: true,
        success_rate: true,
      },
    });

    res.json(statisticsData);
  } catch (error) {
    console.error("❌ statistics Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};
