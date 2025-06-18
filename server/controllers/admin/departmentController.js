const prisma = require('../../config/prisma');

exports.getDepartments = async (req, res) => {

    try {
        const departments = await prisma.department.findMany();
        res.json(departments);
    }
    catch (error) {
        console.error("❌list Department  Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }

};


exports.addDepartment = async (req, res) => {

    try {
        const { departmentName } = req.body;

        console.log("departmentName : ",departmentName);
        
        // ตรวจสอบว่ามีแผนกนี้อยู่แล้วหรือไม่
        const existingDepartment = await prisma.department.findFirst({
            where: {
                departmentName: departmentName,
            },
        });

        if (existingDepartment) {
            return res.status(400).json({
                message: `ไม่สามารถเพิ่มแผนกได้ เนื่องจาก "${departmentName}" มีอยู่แล้วในระบบ`,
                error: "Department already exists",
            });
        }

        // ดึงข้อมูลแผนกล่าสุด
        const lastDepartment = await prisma.department.findFirst({
            orderBy: {
                departmentId: 'desc',  // เรียงลำดับตาม department_id จากมากไปน้อย
            }
        });

        // กำหนด department_id ใหม่
        const newDepartmentId = lastDepartment ? lastDepartment.departmentId +1 :1;
        console.log("newDepartmentId",newDepartmentId);

        // สร้างแผนกใหม่
        const newDepartment = await prisma.department.create({
            data: {
                departmentId: newDepartmentId,  // กำหนด department_id ใหม่ ต่อจาก department ล่าสุด
                departmentName: departmentName,
            },
        });

        res.status(201).json({ // เปลี่ยน status code เป็น 201 Created
            message: `เพิ่มแผนก "${departmentName}" สำเร็จ`,
            department: newDepartment,
        });
    } catch (error) {
        console.error("❌ add department Error:", error);
        // ตรวจสอบว่าเป็น error ที่เกิดจาก unique constraint violation หรือไม่
        if (error.code === 'P2002' && error.meta?.target?.includes('departmentName')) {
            return res.status(400).json({
                message: `ไม่สามารถเพิ่มแผนกได้ เนื่องจาก "${departmentName}" มีอยู่แล้วในระบบ`,
                error: "Department already exists",
            });
        }
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }

 };


exports.editDepartment = async(req, res) => {

    try {
        const { id } = req.params;
        const { departmentName } = req.body;

        const updatedDepartment = await prisma.department.update({
        where: {
            departmentId : parseInt(id)
        },
        data: {
            departmentName
        }
        });
        res.json(updatedDepartment);
    } catch (error) {
        console.error("❌edit Department  Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }

 };


exports.deleteDepartment = async(req, res) => {

    try {
        const { id } = req.params;

        // ดึงข้อมูลแผนกก่อนลบ เพื่อให้รู้ว่าชื่ออะไร
        const department = await prisma.department.findUnique({
            where: { 
                departmentId: parseInt(id)
             }
        });

        if (!department) {
            return res.status(404).json({ message: "ไม่พบแผนกที่ต้องการลบ" });
        }

        // ลบแผนก
        await prisma.department.delete({
            where: { 
                departmentId: parseInt(id)
             }
        });

        // เช็กว่ามีข้อมูลเหลืออยู่ไหม ถ้าไม่มีให้รีเซ็ต AUTO_INCREMENT
        const count = await prisma.department.count();
        if (count === 0) {
            await prisma.$executeRaw`ALTER TABLE department AUTO_INCREMENT = 1`;
        }

        res.json({
            message: `ลบข้อมูลแผนก "${department.departmentName}" สำเร็จ`,
            deletedDepartment: department
        });
    } catch (error) {
        console.error("❌ delete Department Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }

 };