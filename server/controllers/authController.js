const prisma = require("../config/prisma");    // use prisma database
const bcrypt = require("bcryptjs");           
const jwt = require("jsonwebtoken");      
const crypto = require("crypto");
const nodemailer = require("nodemailer");   

exports.register = async (req, res) => {
  try {
    
    // ชื่อผู้ใช้, ชื่อ-นามสกุล, อีเมล, รหัสผ่าน, แผนก, บทบาท
    const { userName,fullName, email, password ,departmentId, role} = req.body;
  
    console.log("register :", userName,fullName, email, password ,departmentId,role);

    //ตรวจสอบว่ามีข้อมูลที่ส่งมาครบหรือไม่
    if(!email || !password || !userName || !fullName || !departmentId || !role) {
      return res.status(400).json({
        message: "กรุณากรอกข้อมูลให้ครบถ้วน"
      })
    }

    //ตรวจสอบว่ามี email นี้ในระบบแล้วหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: {
        email:email   //ค้นหา user โดยใช้ emaiil เป็นเงื่อนไข
      },
    })

    if(existingUser) {
       return res.status(400).json({
        message: "อีเมลนี้มีอยู่ในระบบแล้ว"
       })
    }

    // ทำการ hash password เพื่อเก็บลงฐานข้อมูล
    const hashedPassword = await bcrypt.hash(password, 12);

    //สร้าง user ใหม่ และเก็บลงฐานข้อมูล
    const newUser = await prisma.user.create({
      data: {
        userName:userName,
        fullName:fullName,
        email:email,
        password: hashedPassword,
        department: {
          connect: {
            departmentId : parseInt(departmentId)  // connect department by id
          },
        },
        role:role
      }
    })

    console.log("register newUser success :", newUser);
    res.status(201).json({
      message: "สร้างบัญชีผู้ใช้ใหม่เรียบร้อยแล้ว",
      user: {
        userName:userName,
        fullName:fullName,
        email:email,
        departmentId: {
          connect: {
            departmentId : parseInt(departmentId)  // connect department by id
          },
        },
        role:role
        
      }
    });

  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

exports.login = async (req, res) => {
  try {
   
   const { userName, password } = req.body;
   console.log("login :", userName, password);
   console.log("🔑 JWT_SECRET authController:", process.env.JWT_SECRET);
     //step 1 : check username  ค้นหาผู้ใช้ในฐานข้อมูลโดยใช้ username ที่ได้รับ
    const potentialUsers  = await prisma.user.findMany({
      where: {
        userName:userName //ค้นหา user โดยใช้ userName เป็นเงื่อนไข
      },
      include: {
        department: true  // ดึงข้อมูลแผนกที่เกี่ยวข้องด้วย
      }
    })

    //ถ้าไม่มี username ในระบบ หรือผู้ใช้ยังไม่เปิดใช้งานบ
    if(!potentialUsers || potentialUsers.length === 0) {
      return res.status(400).json({
        message: "ไม่พบบัญชีผู้ใช้นี้ในระบบ"
      })
    }

    let matchedUser = null;

    //ตรวจสอบรหัสผ่านของผู้ใช้แต่ละคนที่พบ
    for( const potentialUser of potentialUsers) {
      // เปรียบเทียบรหัสผ่านที่กรอก กับ hash ในฐานข้อมูล
        const isMatchPassword = await bcrypt.compare(password, potentialUser.password);
        if(isMatchPassword) {
          matchedUser = potentialUser;
          break; // ถ้าพบผู้ใช้ที่ตรงกันให้หยุดการวนลูป
        }
    }

    if(!matchedUser) {
      return res.status(401).json({
        message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
      })

    }

    //step 2 : check password   ตรวจสอบว่า password ที่กรอกตรงกับ password ที่เก็บไว้ในฐานข้อมูลหรือไม่
    // const isMatchPassword = await bcrypt.compare(password,user.password);
    // if(!isMatchPassword) {
    //   return res.status(400).json({
    //     message: "รหัสผ่านไม่ถูกต้อง"
    //   })
    // }
    //step 3 create payload  สร้าง payload สำหรับ JWT โดยรวมข้อมูลผู้ใช้ที่ต้องการเก็บไว้ใน token
    //เช่น id, email, role, fullName, department
    const payload = {
      userId: matchedUser.userId, // ใช้ user_id เพื่อให้ตรงกับ Middleware ที่ตรวจสอบ Token
      email: matchedUser.email,
      userName: matchedUser.userName,
      role: matchedUser.role,
      fullName: matchedUser.fullName,
      // ตรวจสอบก่อนว่ามี department หรือไม่ (เผื่อเป็น null)
      department: matchedUser.department ? {
        department_id: matchedUser.department.departmentId,
        department_name: matchedUser.department.departmentName,
      } : null,
      created_at: matchedUser.createdAt
     }
    console.log("Payload:", payload);

    //step 4 generate token  สร้าง JWT token โดยใช้ payload ที่สร้างขึ้น และกำหนดอายุการใช้งานเป็น 1 วัน
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      },
      (err, token) => {
        if(err) {
          console.error("JWT Error:", err);
          res.status(500).json({ message: "เกิดข้อผิดพลาดในการสร้าง Token" + err.message });
        }

        //ส่งข้อมูล payload และ token กลับไปยัง client
        res.json({
          message: "เข้าสู่ระบบสำเร็จ",
          user: payload,
          token: token,
        })
      }
    )

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

exports.logout = async (req, res) => {
  try {
    console.log("logout");
    
    res.json({
      message: "ออกจากระบบสำเร็จ"
    })

  } catch (error) {
    console.error("❌ Logout Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    console.log("Forgot Password", email);

    //ตรวจสอบว่ามี email นี้ในระบบหรือไม่
    const user = await prisma.user.findUnique({
      where: {
        email : email
      }
    });

    if(!user){
      return res.status(400).json({
        message: "ไม่พบบัญชีผู้ใช้นี้ในระบบ"
      })
    }

       // สร้าง token สำหรับรีเซ็ตรหัสผ่าน
       const resetToken = crypto.randomBytes(32).toString("hex");
       const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
   
    // บันทึก token ลงในฐานข้อมูล พร้อมกำหนดเวลาหมดอายุ (1 ชั่วโมง)
    await prisma.user.update({
      where: { email: email },
      data: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpire: new Date(Date.now() + 60 * 60 * 1000), // 1 ชั่วโมง
      },
    });

        // สร้างลิงก์สำหรับรีเซ็ตรหัสผ่าน
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

           // ส่งอีเมลไปยังผู้ใช้
           const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
              user: process.env.EMAIL_USER, // อีเมลผู้ส่ง
              pass: process.env.EMAIL_PASS, // รหัสผ่านของอีเมลผู้ส่ง
            },
          });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // อีเมลผู้รับ (ที่ผู้ใช้กรอก)
      subject: "รีเซ็ตรหัสผ่าน",
      html: `
        <p>คุณได้ทำการร้องขอรีเซ็ตรหัสผ่าน</p>
        <p>กรุณาคลิกลิงก์ด้านล่างเพื่อรีเซ็ตรหัสผ่าน:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณเรียบร้อยแล้ว",
    });
  } catch (error) {
    console.log("Forgot Password Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpire: {
          gte: new Date(),  // ตรวจสอบว่า token ยังไม่หมดอายุ
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว",
      });
    }
   // อัปเดตรหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email: user.email },
      data: {
        password: hashedPassword,
        resetPasswordToken: null, // ลบ token
        resetPasswordExpire: null, // ลบเวลาหมดอายุ
      },
    });

    res.json({
      message: "รีเซ็ตรหัสผ่านสำเร็จแล้ว",
    });
  } catch (error) {
    console.log("Reset Password Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

// currentUser, currentTechnician, currentAdmin

//แสดงเฉพาะข้อมูลของ user ที่เข้าสู่ระบบ
exports.currentUser = async(req, res) => {

  try {
    
      // ตรวจสอบว่า req.user และ req.user.user_id มีอยู่จริงหรือไม่ (optional but recommended)
      if (!req.user || !req.user.user_id) {
        return res.status(401).json({ message: "ไม่ได้รับอนุญาต หรือ Token ไม่ถูกต้อง" });
     }

    const user = await prisma.user.findUnique({
      where: {
        userId: req.user.user_id // ใช้ userId ที่ได้จาก Middleware
      },
      select: {
        userId: true,
        email: true,
        userName: true,
        fullName: true,
        department: true,
        role: true,
        createdAt: true,
       
      }
    });

      // เพิ่มการตรวจสอบว่าหา user เจอหรือไม่ หลังจาก findUnique
      if (!user) {
        return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
      }

    res.json({
      message: "Current User",
      user: user
    })

  } catch (error) {
    console.error("❌ Current User Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }

}

//แสดงเฉพาะข้อมูลของ technician ที่เข้าสู่ระบบ
exports.currentTechnician = async(req, res) => {

  try {
    
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: "ไม่ได้รับอนุญาต หรือ Token ไม่ถูกต้อง" });
   }

    const technician = await prisma.user.findUnique({
      where: {
        userId: req.user.user_id // ใช้ userId ที่ได้จาก Middleware
      },
      select: {
        userId: true,
        email: true,
        userName: true,
        fullName: true,
        department: true,
        role: true,
        createdAt: true,

      }
    });

       // เพิ่มการตรวจสอบว่าหา user เจอหรือไม่ หลังจาก findUnique
       if (!technician) {
        return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้ (Technician)" });
      }

    res.json({
      message: "Current Technician",
      technician: technician
    })

  } catch (error) {
    console.error("❌ Current Technician Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }

}

//แสดงเฉพาะข้อมูลของ admin ที่เข้าสู่ระบบ
exports.currentAdmin = async(req, res) => {

  try {

    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: "ไม่ได้รับอนุญาต หรือ Token ไม่ถูกต้อง" });
   }
    
    const admin = await prisma.user.findUnique({
      where: {
        userId: req.user.user_id // ใช้ userId ที่ได้จาก Middleware
      },
      select: {
        userId: true,
        email: true,
        userName: true,
        fullName: true,
        department: true,
        role: true,
        createdAt: true,
      }
    });

    if (!admin) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้ (Admin)" });
    }

    res.json({
      message: "Current Admin",
      admin: admin
    })

  } catch (error) {
    console.error("❌ Current Admin Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }

}

