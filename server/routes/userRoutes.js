const express = require('express');
const router = express.Router();
const {getNotifications} = require('../controllers/user/notificationController');
const {getRepairReports} = require('../controllers/user/reportController');
const { addSchedule,editSchedule } = require('../controllers/user/scheduleController');
const { saveSetting,editSetting } = require('../controllers/user/settingController');
const {getAssets, addAsset,editAsset,deleteAsset} = require('../controllers/user/assetController');
const {getRepairs,getRepairById,addRepair,editRepair,deleteRepair} = require('../controllers/user/repairController');

const {  authCheckAdmin ,authCheckNormal, authCheckUser, authCheckTechnician } = require('../middlewares/authMiddleware');

// แสดงข้อมูลใน dashboard
router.get('/repairs',authCheckUser, getRepairs);     //ดึงรายการผู้ใช้ทั้งหมด
router.get('/repair',authCheckUser, getRepairById);
router.post('/add-repair',authCheckUser, addRepair);
router.put('/edit-repair/:id',authCheckUser, editRepair);
router.delete('/delete-repair/:id',authCheckUser, deleteRepair);

// แสดงข้อมูลทรัพย์สิน
router.get('/assets',authCheckUser, getAssets);
router.post('/add-asset',authCheckUser, addAsset);
router.put('/edit-asset/:id',authCheckUser, editAsset);
router.delete('/delete-asset/:id',authCheckUser, deleteAsset);

//แสดงตารางเวลา
router.post('/add-schedule',authCheckUser,addSchedule);
router.put('/edit-schedule',authCheckUser,editSchedule);

//เกี่ยวกับการตั้งค่า
router.post('/save-setting',authCheckUser,saveSetting);
router.put('/edit-setting',authCheckUser,editSetting);

//เกี่ยวกับการแจ้งเตือน
router.get('/notification',authCheckUser,getNotifications);

// เกี่ยวกับรายงาน
router.get('/data-repair',authCheckUser,getRepairReports);

module.exports = router;