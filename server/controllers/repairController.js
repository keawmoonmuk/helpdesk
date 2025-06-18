const prisma = require("../config/prisma");    

// **** เพิ่มรายการแจ้งซ่อม ****
exports.addRepair  = async (req, res) => {
try {

  // ข้อมูลจาก frontend ทั้งหมด คือ วันที่แจ้งซ่อม, ชื่อผู้แจ้ง , แผนก, อาคาร, ชั้น, ชื่อสินทรัพย์, หมายเลขสินทรัพย์,หมายเลขเครื่อง, สถานที่สินทรัพย์, รายละเอียด, ความสำคัญ, สถานะ, รูปภาพ
   const { departmentId, building,floor, assetName, assetSerial, assetCode, assetLocation, detailRepair,importance,status,images} = req.body;
  console.log("importance =>",importance, "status",status);
   const createdBy = req.user ? req.user.user_id : null; // ดึง user_id จาก token
//console.log("data from frontend :", departmentId, building,floor, assetName, assetSerial, assetCode, assetLocation, detailRepair,importance,status,images);
   console.log("get req user id :", createdBy);

  // แปลงค่าจาก Frontend ให้ตรงกับ enum ใน Prisma Schema
  const importanceMap = {
    "ต่ำ": "LOW",
    "ปานกลาง": "MEDIUM",
    "สูง": "HIGH",
    "Moderate": "MEDIUM",
  };

  const statusMap = {
    "รอดำเนินการ": "PENDING",
    "กำลังดำเนินการ": "IN_PROGRESS",
    "เสร็จสิ้น": "COMPLETED",
    "ยกเลิก": "CANCELLED",
  };

  const importanceEnum = importanceMap[importance];
  const statusEnum = statusMap[status];
 console.log("importanceEnum",importanceEnum, "statusEnum",statusEnum);

 console.log("createBy",createdBy, "departmentId",departmentId, "building",building,"floor",floor, "assetName",assetName, "assetSerial",assetSerial,"assetLocation",assetLocation, "detailRepair",detailRepair, "importance :",importance,"(status)",status,"images",images)
    //ตรวจสอบว่ามีข้อมูลที่ส่งมาหรือไม่
    if(!createdBy || !departmentId || !building || !floor || !assetName || !assetSerial || !assetLocation || !detailRepair || !importance || !status || !images){
        return res.status(400).json({
            message: "กรุณากรอกข้อมูลให้ครบถ้วน"
        });
    }

    //ตรวจสอบว่ามีสินทรัพย์ที่ต้องการแจ้งซ่อมหรือไม่
    let asset = await prisma.asset.findFirst({
        where: {
            assetName: assetName,
            assetSerial: assetSerial,
            assetCode: assetCode,
            assetLocation: assetLocation,
        },
    });

    // หากไม่มีสินทรัพย์ที่ต้องการแจ้งซ่อม ให้สร้างสินทรัพย์ใหม่ ใน ตาราง asset
    if(!asset){
        asset = await prisma.asset.create({
            data: {
                assetName: assetName,
                assetSerial: assetSerial,
                assetCode: assetCode,
                assetLocation: assetLocation,
                status: "AVAILABLE",
            
            }
        })
    }

    console.log("assetId :", asset.assetId);
    // สร้าง repair request โดยใช้ assetId ที่ได้จาก ตาราง asset
    const repairRequest = await prisma.repairRequest.create({
        data: {
          createdBy: createdBy, // รหัสผู้สร้างคำขอ
          departmentId: departmentId ? parseInt(departmentId) : null, // ตรวจสอบและแปลงค่า departmentId
          building: building, // อาคารที่เกี่ยวข้อง
          floor: floor, // ชั้นที่เกี่ยวข้อง
          assetId:  asset.assetId, // ใช้ assetId หากมีค่า
          detail: detailRepair, // รายละเอียดการแจ้งซ่อม
          importance: importanceEnum, // ความสำคัญ (ต้องตรงกับ enum)
          status: statusEnum, // สถานะ (ต้องตรงกับ enum)
          location: assetLocation, // สถานที่ที่เกี่ยวข้อง
        },
        include: {
            creator: {
                select: {
                    userId: true,
                    userName: true,
                    fullName: true,
                    email: true,
                    role: true
                },
            },
            department: {
                select: {
                    departmentId: true,
                    departmentName: true,
                },
            }
        }
      });

    //บันทึกรูปภาพลงในตาราง RepairImage
    if (Array.isArray(images)) {
        const imageData = images.map((imageUrl) => ({
          requestId: repairRequest.requestId,
          imageUrl: imageUrl,
          type: "INTERNAL",
        }));
      
        await prisma.repairImage.createMany({
          data: imageData,
        });
      } else {
        await prisma.repairImage.create({
          data: {
            requestId: repairRequest.requestId,
            imageUrl: images,
            type: "INTERNAL",
          },
        });
      }

      res.json({
        message: "เพิ่มรายการแจ้งซ่อมเรียบร้อยแล้ว",
        data: {
          requestId: repairRequest.requestId,
          createdBy: {
            userId: repairRequest.creator.userId,
            userName: repairRequest.creator.userName, // ชื่อผู้แจ้ง
            fullName: repairRequest.creator.fullName, // ชื่อเต็ม
            email: repairRequest.creator.email, // อีเมล
            role: repairRequest.creator.role, // ตำแหน่ง
          },
          department: repairRequest.department
            ? {
                departmentId: repairRequest.department.departmentId,
                departmentName: repairRequest.department.departmentName, // ชื่อแผนก
              }
            : null,
          assetId: repairRequest.assetId,
          detail: repairRequest.detail,
          building: repairRequest.building,
          floor: repairRequest.floor,
          location: repairRequest.location,
          importance: repairRequest.importance,
          status: repairRequest.status,
          created_at: repairRequest.created_at,
          updated_by: repairRequest.updated_by,
          updated_at: repairRequest.updated_at,
          cause: repairRequest.cause,
          solution: repairRequest.solution,
          inspected_at: repairRequest.inspected_at,
          inspected_by: repairRequest.inspected_by,
          decide_id: repairRequest.decide_id,
          decide_cause: repairRequest.decide_cause,
          checkout_at: repairRequest.checkout_at,
          checkout_by: repairRequest.checkout_by,
          is_approved_outsource: repairRequest.is_approved_outsource,
          reject_outsource_reason: repairRequest.reject_outsource_reason,
        },
      });
    
} catch (error) {
    console.error("❌ create repair Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    
}
}

//***** แสดงรายการแจ้งซ่อมทั้งหมด ********
exports.listRepairs  = async (req, res) => {
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
       inspector: {
      select: {
        userId: true,
        fullName: true,
        email: true,
        role: true,
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
}

//*****แก้ไขแจ้งซ่อมได้ แต่ต้องเป็นของตัวเองเท่านั้น  ***********
exports.editRepair = async (req, res) => {
    try {
      const repairRequestId = parseInt(req.params.id, 10); // ดึง ID ของรายการแจ้งซ่อมจาก URL
      const {
        departmentId,
        building,
        floor,
        assetName,
        assetSerial,
        assetLocation,
        detailRepair,
        importance,
        status,
        images,
      } = req.body;
  
      const updatedBy = req.user ? req.user.user_id : null; // รหัสผู้แก้ไขรายการ
  
      console.log("repairRequestId:", repairRequestId);
      console.log("updatedBy:", updatedBy);
  
      // แปลงค่าจาก Frontend ให้ตรงกับ enum ใน Prisma Schema
      const importanceMap = {
        ต่ำ: "LOW",
        ปานกลาง: "MEDIUM",
        สูง: "HIGH",
      };
  
      const statusMap = {
        "รอเดินการ": "PENDING",
        "กำลังดำเนินการ": "IN_PROGRESS",
        "เสร็จสิ้น": "COMPLETED",
        "ยกเลิก": "CANCELLED",
      };
  
      const importanceEnum = importanceMap[importance];
      const statusEnum = statusMap[status];
  
      // ตรวจสอบว่ามีข้อมูลที่ส่งมาหรือไม่
      if (
        !updatedBy ||
        !departmentId ||
        !building ||
        !floor ||
        !assetName ||
        !assetSerial ||
        !assetLocation ||
        !detailRepair ||
        !importance ||
        !status ||
        !images
      ) {
        return res.status(400).json({
          message: "กรุณากรอกข้อมูลให้ครบถ้วน",
        });
      }
  
      // ตรวจสอบว่ารายการแจ้งซ่อมมีอยู่หรือไม่
      const repairRequest = await prisma.repairRequest.findUnique({
        where: { 
            requestId: repairRequestId 
        },
        include: { creator: true },
      });
  
      console.log("repairRequest:", repairRequest);
      if (!repairRequest) {
        return res.status(404).json({
          message: "ไม่พบรายการแจ้งซ่อม",
        });
      }
  
      // ตรวจสอบสิทธิ์การแก้ไข (เฉพาะเจ้าของหรือ Admin/Technician เท่านั้น)
      if (
        req.user.role !== "admin" &&
        req.user.role !== "technician" &&
        repairRequest.createdBy !== updatedBy
      ) {
        return res.status(403).json({
          message: "คุณไม่มีสิทธิ์แก้ไขรายการแจ้งซ่อมนี้",
        });
      }
  
      // ตรวจสอบว่ามีสินทรัพย์ที่ต้องการแจ้งซ่อมหรือไม่
      let asset = await prisma.asset.findFirst({
        where: {
          assetName: assetName,
          assetSerial: assetSerial,
          assetLocation: assetLocation,
        },
      });
  
      // หากไม่มีสินทรัพย์ที่ต้องการแจ้งซ่อม ให้สร้างสินทรัพย์ใหม่
      if (!asset) {
        asset = await prisma.asset.create({
          data: {
            assetName: assetName,
            assetSerial: assetSerial,
            assetLocation: assetLocation,
            status: "AVAILABLE",
          },
        });
      }
  
      // อัปเดตรายการแจ้งซ่อม
      const updatedRepairRequest = await prisma.repairRequest.update({
        where: { requestId: repairRequestId },
        data: {
          updated_by: updatedBy, // รหัสผู้แก้ไข
          departmentId: departmentId ? parseInt(departmentId) : null,
          building: building,
          floor: floor,
          assetId: asset ? asset.id : null,
          detail: detailRepair,
          importance: importanceEnum,
          status: statusEnum,
          location: assetLocation,
          updated_at: new Date(), // อัปเดตวันที่แก้ไขล่าสุด
        },
        include: {
          creator: {
            select: {
              userId: true,
              userName: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
          department: {
            select: {
              departmentId: true,
              departmentName: true,
            },
          },
        },
      });
  
      // อัปเดตรูปภาพในตาราง RepairImage
      if (Array.isArray(images)) {
        // ลบรูปภาพเก่าที่เกี่ยวข้องกับรายการนี้
        await prisma.repairImage.deleteMany({
          where: { requestId: repairRequestId },
        });
  
        // เพิ่มรูปภาพใหม่
        const imageData = images.map((imageUrl) => ({
          requestId: repairRequestId,
          imageUrl: imageUrl,
          type: "INTERNAL",
        }));
  
        await prisma.repairImage.createMany({
          data: imageData,
        });
      }
  
      res.json({
        message: "แก้ไขรายการแจ้งซ่อมเรียบร้อยแล้ว",
        data: {
          requestId: updatedRepairRequest.id,
          updatedBy: {
            userId: updatedRepairRequest.creator.userId,
            userName: updatedRepairRequest.creator.userName,
            fullName: updatedRepairRequest.creator.fullName,
            email: updatedRepairRequest.creator.email,
            role: updatedRepairRequest.creator.role,
          },
          department: updatedRepairRequest.department
            ? {
                departmentId: updatedRepairRequest.department.departmentId,
                departmentName: updatedRepairRequest.department.departmentName,
              }
            : null,
          assetId: updatedRepairRequest.assetId,
          detail: updatedRepairRequest.detail,
          building: updatedRepairRequest.building,
          floor: updatedRepairRequest.floor,
          location: updatedRepairRequest.location,
          importance: updatedRepairRequest.importance,
          status: updatedRepairRequest.status,
          updated_at: updatedRepairRequest.updated_at,
        },
      });
    } catch (error) {
      console.error("❌ edit repair Error:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
  };

//******* ลบแจ้งซ่อมได้ แต่ต้องเป็นของตัวเองเท่านั้น  ****************
exports.deleteRepair = async (req, res) => {
    try {
      const repairRequestId = parseInt(req.params.id, 10); // ดึง ID ของรายการแจ้งซ่อมจาก URL
  
      // ค้นหารายการแจ้งซ่อม
      const repair = await prisma.repairRequest.findUnique({
        where: { requestId: repairRequestId }, // ใช้ requestId แทน id
      });
  
      if (!repair) {
        return res.status(404).json({ message: "ไม่พบรายการแจ้งซ่อม" });
      }
  
      // ✅ ตรวจสอบสิทธิ์การลบ
      if (
        req.user.role !== "admin" && // Admin สามารถลบได้ทุกคน
        req.user.role !== "technician" && // Technician สามารถลบได้ทุกคน
        repair.createdBy !== req.user.user_id // ผู้ใช้ทั่วไปลบได้เฉพาะรายการของตัวเอง
      ) {
        return res.status(403).json({ message: "ไม่มีสิทธิ์ลบรายการนี้" });
      }

        // ลบข้อมูลที่เกี่ยวข้องในตาราง RepairImage
    await prisma.repairImage.deleteMany({
        where: { requestId: repairRequestId },
      });
  
      // ลบรายการแจ้งซ่อม
      await prisma.repairRequest.delete({
        where: { requestId: repairRequestId }, // ใช้ requestId แทน id
      });
  
      res.json({ message: "ลบรายการแจ้งซ่อมสำเร็จ" });
    } catch (error) {
      console.error("❌ Error deleting repair:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
  };

  //***** status การซ่อม  *****
  exports.statusRepair = async (req, res) => {
    try {
      const repairRequestId = parseInt(req.params.id, 10);
      const { status } = req.body;
  
      // ตรวจสอบว่ามีการส่งสถานะใหม่มาหรือไม่
      if (!status) {
        return res.status(400).json({ message: "กรุณาระบุสถานะใหม่" });
      }
  
      // แปลงค่าจาก Frontend ให้ตรงกับ enum ใน Prisma Schema
      const statusMap = {
        "รอเดินการ": "PENDING",
        "กำลังดำเนินการ": "IN_PROGRESS",
        "เสร็จสิ้น": "COMPLETED",
        "ยกเลิก": "CANCELLED",
      };
  
      const statusEnum = statusMap[status];
      if (!statusEnum) {
        return res.status(400).json({ message: "สถานะที่ระบุไม่ถูกต้อง" });
      }
  
      // ค้นหารายการแจ้งซ่อม
      const repairRequest = await prisma.repairRequest.findUnique({
        where: { requestId: repairRequestId },
      });
  
      if (!repairRequest) {
        return res.status(404).json({ message: "ไม่พบรายการแจ้งซ่อม" });
      }
  
      // ✅ ตรวจสอบสิทธิ์การเปลี่ยนสถานะ
      if (
        req.user.role !== "admin" &&
        req.user.role !== "technician" &&
        repairRequest.createdBy !== req.user.user_id
      ) {
        return res.status(403).json({ message: "ไม่มีสิทธิ์เปลี่ยนสถานะรายการนี้" });
      }
  
      // อัปเดตสถานะในฐานข้อมูล
      const updatedRepairRequest = await prisma.repairRequest.update({
        where: { requestId: repairRequestId },
        data: { status: statusEnum },
      });
  
      res.json({
        message: "อัพเดทสถานะการซ่อมเรียบร้อยแล้ว",
        data: updatedRepairRequest,
      });
    } catch (error) {
      console.error("❌ status repair Error:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
  };
