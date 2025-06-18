//สามารถใช้ PrismaClient ในทุกไฟล์ในโปรเจคได้โดยไม่ต้อง import ใหม่ทุกครั้ง
const { PrismaClient }  = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = prisma;