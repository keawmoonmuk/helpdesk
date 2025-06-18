const prisma = require("../config/prisma");

// ให้คะแนนแจ้งซ่อม
exports.rateRepair = async (req, res) => {
  try {
    const repairRequestId = parseInt(req.params.id, 10);
    const { rating } = req.body;

    // ตรวจสอบว่าค่าคะแนนอยู่ในช่วงที่ถูกต้อง (1-5)
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "คะแนนต้องอยู่ระหว่าง 1-5" });
    }

    // ตรวจสอบว่ามีรายการแจ้งซ่อมนี้หรือไม่
    const repairRequest = await prisma.repairRequest.findUnique({
      where: { id: repairRequestId },
    });

    if (!repairRequest) {
      return res.status(404).json({ message: "ไม่พบรายการแจ้งซ่อม" });
    }

    // ให้เฉพาะเจ้าของแจ้งซ่อมเท่านั้นที่สามารถให้คะแนนได้
    if (repairRequest.userId !== req.user.id) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์ให้คะแนนรายการนี้" });
    }

    const updatedRepair = await prisma.repairRequest.update({
      where: { id: repairRequestId },
      data: { rating: rating },
    });

    res.json({ message: "ให้คะแนนเรียบร้อยแล้ว", data: updatedRepair });
  } catch (error) {
    console.error("❌ rate repair Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

// เพิ่มรีวิวแจ้งซ่อม
exports.reviewRepair = async (req, res) => {
  try {
    const repairRequestId = parseInt(req.params.id, 10);
    const { review } = req.body;

    if (!review) {
      return res.status(400).json({ message: "กรุณากรอกข้อความรีวิว" });
    }

    const repairRequest = await prisma.repairRequest.findUnique({
      where: { id: repairRequestId },
    });

    if (!repairRequest) {
      return res.status(404).json({ message: "ไม่พบรายการแจ้งซ่อม" });
    }

    if (repairRequest.userId !== req.user.id) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์รีวิวรายการนี้" });
    }

    const updatedRepair = await prisma.repairRequest.update({
      where: { id: repairRequestId },
      data: { review: review },
    });

    res.json({ message: "เพิ่มรีวิวเรียบร้อยแล้ว", data: updatedRepair });
  } catch (error) {
    console.error("❌ review repair Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

// แก้ไขรีวิว
exports.editReviewRepair = async (req, res) => {
  try {
    const repairRequestId = parseInt(req.params.id, 10);
    const { review } = req.body;

    if (!review) {
      return res.status(400).json({ message: "กรุณากรอกข้อความรีวิว" });
    }

    const repairRequest = await prisma.repairRequest.findUnique({
      where: { id: repairRequestId },
    });

    if (!repairRequest) {
      return res.status(404).json({ message: "ไม่พบรายการแจ้งซ่อม" });
    }

    if (repairRequest.userId !== req.user.id) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์แก้ไขรีวิวนี้" });
    }

    const updatedRepair = await prisma.repairRequest.update({
      where: { id: repairRequestId },
      data: { review: review },
    });

    res.json({ message: "แก้ไขรีวิวเรียบร้อยแล้ว", data: updatedRepair });
  } catch (error) {
    console.error("❌ edit review repair Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

// ลบรีวิว
exports.deleteReviewRepair = async (req, res) => {
  try {
    const repairRequestId = parseInt(req.params.id, 10);

    const repairRequest = await prisma.repairRequest.findUnique({
      where: { id: repairRequestId },
    });

    if (!repairRequest) {
      return res.status(404).json({ message: "ไม่พบรายการแจ้งซ่อม" });
    }

    if (repairRequest.userId !== req.user.id) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์ลบรีวิวนี้" });
    }

    const updatedRepair = await prisma.repairRequest.update({
      where: { id: repairRequestId },
      data: { review: null },
    });

    res.json({ message: "ลบรีวิวเรียบร้อยแล้ว", data: updatedRepair });
  } catch (error) {
    console.error("❌ delete review repair Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};