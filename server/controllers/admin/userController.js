const prisma = require('../../config/prisma');
const bcrypt = require("bcryptjs");

exports.getUsers =async (req, res) => {

    try {
    
        const users = await prisma.user.findMany();
    
        res.json(users);
    
      } catch (error) {
        console.error("❌list Users  Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
      }

};

exports.getUsersById = async (req,res)=> {

    try {
        const userId = parseInt(req.params.id);
    
        if (!userId || isNaN(userId)) {
          return res.status(400).json({ message: "Invalid User ID" });
        }
    
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    
      } catch (error) {
        console.error("❌ Get User Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
      }

};

exports.addUser = async(req, res) => {

    try {

        const { username, email, password, role } = req.body;
    
        if(!fullname || !email || !password || !role){
          return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }
    
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        const newUser = await prisma.user.create({
          data: {
            username : username,
            email : email,
            password : hashedPassword,
            role : role,
          },
        });
    
        res.json(newUser);
      
      } catch (error) {
        console.error("❌ add user Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
      }

};
exports.editUser = async(req, res) => {

    try {
        const userId = parseInt(req.params.id); // Get user ID from params
        const { fullName, email, role } = req.body;   //  Add/remove fields as needed
    
        // Validate input (add more robust validation as needed)
        if (!userId || isNaN(userId)) {
          return res.status(400).json({ message: "Invalid User ID" });
        }
    
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { fullName, email, role }, // Update user fields as needed
        });
        res.json(updatedUser);
      } catch (error) {
        console.error("❌ Edit User Error:", error);
        if (error.code === 'P2025') { //Handle user not found
          return res.status(404).json({ message: "User not found" });
        }
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
      }

};

exports.deleteUser = async(req, res) => {

    try {
        const userId = parseInt(req.params.id);
    
        if (!userId || isNaN(userId)) {
          return res.status(400).json({ message: "Invalid User ID" });
        }
    
        await prisma.user.delete({
          where: { id: userId },
        });
        res.json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("❌ Delete User Error:", error);
        if (error.code === 'P2025') { //Handle user not found
          return res.status(404).json({ message: "User not found" });
        }
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
      }

};