const prisma = require('../../config/prisma');

exports.getRepairs = async(req, res) => {

    try {
    
        // ดึงข้อมูลรายการแจ้งซ่อมทั้งหมด
         const repairRequests = await prisma.repairRequest.findMany({
          orderBy:  {
               created_at: 'desc', // เรียงลำดับตามวันที่แจ้งซ่อม (ล่าสุดอยู่บนสุด)
          },
          
          include:  {
             creator: {
              select:  {
                userId:true,
                fullName: true,
                email: true,
                role: true,
              },
             },
             asset: {
              select: {
                assetName: true,
                assetSerial: true,
                assetCode: true,
                assetLocation: true,
              },
             },
             department:  {
              select: {
                departmentId: true,
                departmentName: true,
              },
             },
          },
         });
      
         res.json({
          message: "แสดงรายการแจ้งซ่อมทั้งหมด",
          data: repairRequests,
         });
      
      } catch (error) {
          console.error("❌ read repair Error:", error);
          res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
      }

};
exports.repairOutside = (req, res) => {};