const prisma = require("../config/prisma");


// ดึงรายชื่อช่างทั้งหมด
exports.listTechnicians = async (req, res) => {
  try {
    const technicians = await prisma.technician.findMany();
    res.json(technicians);
  } catch (error) {
    console.error("❌ listTechnicians Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

// เพิ่มช่างใหม่
exports.addTechnician = async (req, res) => {
  try {
    const { name, email, phone, specialization } = req.body;

    const newTechnician = await prisma.technician.create({
      data: {
        name,
        email,
        phone,
        specialization,
      },
    });

    res.json(newTechnician);
  } catch (error) {
    console.error("❌ addTechnician Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

// แก้ไขข้อมูลช่าง
exports.editTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, specialization } = req.body;

    const updatedTechnician = await prisma.technician.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        specialization,
      },
    });

    res.json(updatedTechnician);
  } catch (error) {
    console.error("❌ editTechnician Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

// ลบข้อมูลช่าง
exports.deleteTechnician = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.technician.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "ลบช่างเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("❌ deleteTechnician Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};
