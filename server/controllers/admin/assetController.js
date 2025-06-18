const prisma = require('../../config/prisma');

exports.getAssets =async (req, res) => {

    try {
        const assets = await prisma.asset.findMany({
          include: {
            repairRequests: true,
            maintenanceLogs: true,
          }
        });
    
        res.json(assets);
    
    
      } catch (error) {
        console.error("❌ list assets Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
      }

};
exports.addAsset = async (req, res) => {

    try {
        const { 
          assetName, assetNumber, assetType, manufacturer, model, serialNumber, 
          purchaseDate, warrantyExpire, specifications, location, status, 
          repairRequests, maintenanceLogs 
        } = req.body;
    
        // ตรวจสอบค่า status ว่ามีค่าที่ถูกต้องหรือไม่
        const validStatuses = ["active", "repair", "inactive", "disposed"];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ message: "Invalid status value" });
        }
    
        const newAsset = await prisma.asset.create({
          data: {
            assetName,
            assetNumber,
            assetType,
            manufacturer,
            model,
            serialNumber,
            purchaseDate: new Date(purchaseDate),
            warrantyExpire: new Date(warrantyExpire),
            specifications: specifications ? JSON.parse(specifications) : {},
            location,
            status,
            repairRequests: {
              create: repairRequests?.map((repair) => ({
                userId: repair.userId,
                requestDetails: repair.requestDetails,
                urgencyLevel: repair.urgencyLevel,
                status: repair.status,
                requireExternal: repair.requireExternal,
                department: repair.department,
                building: repair.building,
                floor: repair.floor
              })) || [],
            },
            maintenanceLogs: {
              create: maintenanceLogs?.map((maintenance) => ({
                maintenanceType: maintenance.maintenanceType,
                details: maintenance.details,
                performedAt: new Date(maintenance.performedAt),
                nextScheduled: maintenance.nextScheduled ? new Date(maintenance.nextScheduled) : null
              })) || [],
            },
          },
          include: {
            repairRequests: true,
            maintenanceLogs: true,
          },
        });
    
        res.json(newAsset);
      } catch (error) {
        console.error("❌ add assets Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
      }

};


exports.editAsset = async(req, res) => {

    try {
        const { id } = req.params;
        if (!id || isNaN(parseInt(id))) {
          return res.status(400).json({ message: "Invalid asset ID" });
        }
    
        const {
          assetName,
          assetNumber,
          assetType,
          manufacturer,
          model,
          serialNumber,
          purchaseDate,
          warrantyExpire,
          specifications,
          location,
          status,
        } = req.body;
    
        // ตรวจสอบค่า status
        const validStatuses = ["active", "repair", "inactive", "disposed"];
        const formattedStatus = status?.toLowerCase(); // ทำให้เป็นตัวพิมพ์เล็กก่อนตรวจสอบ
        if (!validStatuses.includes(formattedStatus)) {
          return res.status(400).json({ message: "Invalid status value" });
        }
    
        // ตรวจสอบค่า purchaseDate และ warrantyExpire
        const parsedPurchaseDate = new Date(purchaseDate);
        const parsedWarrantyExpire = new Date(warrantyExpire);
    
        if (isNaN(parsedPurchaseDate.getTime()) || isNaN(parsedWarrantyExpire.getTime())) {
          return res.status(400).json({ message: "Invalid date format" });
        }
    
        // ตรวจสอบ JSON specifications
        let parsedSpecifications = {};
        if (specifications) {
          try {
            parsedSpecifications = JSON.parse(specifications);
          } catch (error) {
            return res.status(400).json({ message: "Invalid JSON format for specifications" });
          }
        }
    
        // อัปเดตข้อมูล
        const editAsset = await prisma.asset.update({
          where: { id: parseInt(id) },
          data: {
            assetName,
            assetNumber,
            assetType,
            manufacturer,
            model,
            serialNumber,
            purchaseDate: parsedPurchaseDate,
            warrantyExpire: parsedWarrantyExpire,
            specifications: parsedSpecifications,
            location,
            status: formattedStatus,
          },
          include: {
            repairRequests: true,
            maintenanceLogs: true,
          },
        });
    
        res.json(editAsset);
      } catch (error) {
        console.error("❌ editAssets Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
      }

};


exports.deleteAsset =async (req, res) => {

    try {
        const { id } = req.params;
     
        // ตรวจสอบว่า id ที่รับมาเป็นตัวเลขหรือไม่
        if(isNaN(id)){
         return res.status(400).json({ message: "Invalid asset id" });
        }
     
     
        const deleteAsset = await prisma.asset.delete({
         where: { id: parseInt(id) },
       });
         res.json(deleteAsset);
     
       } catch (error) {
         console.error("❌ Register Error:", error);
         res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
       }

};