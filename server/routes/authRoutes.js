const express = require("express");
const router = express.Router();
const { register,login,logout,forgotPassword, currentUser, currentTechnician, currentAdmin} = require("../controllers/authController");
const { authCheck, authCheckNormal, authCheckTechnician, authCheckAdmin } = require("../middlewares/authMiddleware");

//ex. http://localhost:5000/api/auth/register
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotpassword", forgotPassword);

router.post("/current-user", authCheckNormal, currentUser);
router.post("/current-technician", authCheckNormal,authCheckTechnician, currentTechnician);
router.post("/current-admin", authCheckNormal,authCheckAdmin, currentAdmin);

module.exports = router;
