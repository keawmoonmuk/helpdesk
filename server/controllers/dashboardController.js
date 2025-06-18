
const prisma = require('../config/prisma');

//show for user
exports.allRepairRequests = async (req, res) => {
  try {
    console.log("Header Token:", req.headers.authorization);
    // ดึงข้อมูลรายการแจ้งซ่อม
    // ทั้งหมด พร้อมข้อมูลผู้ใช้และทรัพย์สิน
    const repairRequests = await prisma.repairRequest.findMany({
      orderBy: {
        created_at: 'desc', // เรียงลำดับตามวันที่แจ้งซ่อม (ล่าสุดอยู่บนสุด)
      },
      include: {
        creator: { // รวมข้อมูลผู้สร้างคำขอ
          select: {
            userId: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        asset: { // รวมข้อมูลทรัพย์สินที่เกี่ยวข้อง
          select: {
            assetName: true,
            assetSerial: true,
            assetLocation: true,
          },
        },
        department: { // รวมข้อมูลแผนกที่เกี่ยวข้อง
          select: {
            departmentId: true,
            departmentName: true,
          },
        },
      },
    });

    // ส่งข้อมูลกลับไปยัง Client
    res.json({
      message: "All Repair Requests",
      repairRequests: repairRequests,
    });
  } catch (error) {
    console.error("❌ User Dashboard Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};
//show for technical
exports.technician = async (req, res) => {
try {
    // console.log("technician dashboard")
    // res.send("technician dashboard")
    const technician = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      include: {
        assignedRepairs :true
      },
    })

    if(!technician) {
      return res.status(404).json({
        message: "Technician not found"
      });
    }

    const assignedRepairs = technician.assignedRepairs.filter(assignment => assignment.status !== 'completed' && assignment.status !== 'cancelled');

    res.json({
      message: "Technician Dashboard",
      technicianData: {
        fullName: technician.fullName,
        assignedRepairs: assignedRepairs.length,
      },
    })

} catch (error) {
    console.error("❌  Technician Dashboard Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
}
}


//show for admin
exports.admin = async (req, res) => {
try {
    // console.log("admin dashboard");
    // res.send("admin dashboard");
    const totalRepairRequests = await prisma.repairRequest.count();
    const openRepairRequests = await prisma.repairRequest.count({
      where: {
        status: {
          not: ['completed', 'cancelled']
        }
      }
    });
    const totalAssets = await prisma.asset.count();

    res.json({
      message: 'Admin Dashboard',
      adminData: {
        totalRepairRequests,
        openRepairRequests,
        totalAssets,
      }
    })
    
} catch (error) {
    console.error("❌ Admin Dashboard Error  :", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
}
}