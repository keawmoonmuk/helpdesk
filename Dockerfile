# ใช้ Node.js v22 เป็น base image
FROM node:22

# ตั้ง working directory ภายใน container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json (ถ้ามี)
COPY server/package*.json ./

# คัดลอก prisma schema และ migration ก่อน install dependencies (เพื่อให้ postinstall หา schema.prisma เจอ)
COPY server/prisma ./prisma

# ติดตั้ง dependencies
RUN npm install

# คัดลอก source code ทั้งหมดของ backend (ยกเว้น prisma ที่ copy ไปแล้ว)
COPY server/. .

# กำหนดให้ Prisma สร้าง client (หากใช้ Prisma)
RUN npx prisma generate

# เปิดพอร์ต (ต้องตรงกับที่ server.js ใช้ เช่น 5000)
EXPOSE 5000

# รันแอป
CMD ["npm", "start"]
