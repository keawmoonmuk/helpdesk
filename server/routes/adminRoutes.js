const express = require('express');
const router = express.Router();
// const {addDepartment,listDepartment,editDepartment,deleteDepartment} = require('../controllers/adminController');

const {getAssets,addAsset,editAsset,deleteAsset} = require('../controllers/admin/assetController');
const {getDepartments,addDepartment,editDepartment,deleteDepartment} = require('../controllers/admin/departmentController');
const {getNotifications} = require('../controllers/admin/notificationController');
const {getRepairs,addRepair,editRepair,deleteRepair} = require('../controllers/admin/repairController');
const {addSchedule,editSchedule} = require('../controllers/admin/scheduleController');
const {saveSetting,editSetting} = require('../controllers/admin/settingController');
const {getTasks,addTask,editTask,deleteTask} = require('../controllers/admin/taskController');
const {getUsers,addUser,editUser,deleteUser} = require('../controllers/admin/userController');
const { getReports } = require('../controllers/admin/reportController');

// department
// router.post('/add-department',addDepartment); // เพิ่มแผนก
// router.get('/list-department',listDepartment); // ดึงรายการแผนกทั้งหมด
// router.put('/edit-department/:id',editDepartment); // แก้ไขแผนก
// router.delete('/delete-department/:id',deleteDepartment); // ลบแผนก


// แสดงข้อมูลใน dashboard
router.get('/repairs',getRepairs);
router.post('/add-repair', addRepair);
router.put('/edit-repair/:id',editRepair);
router.delete('/delete-repair/:id', deleteRepair);

// สำหรับ จัดการผู้ใช้งาน
router.get('/users',getUsers);
router.post('/add-user', addUser);
router.put('/edit-user/:id', editUser);
router.delete('/delete-user/:id', deleteUser);

// แสดงข้อมูลทรัพย์สิน
router.get('/assets',getAssets);
router.post('/add-asset', addAsset);
router.put('/edit-asset/:id',editAsset);
router.delete('/delete-asset/:id',deleteAsset);

// department  แผนก
router.get('/departments',getDepartments);
router.post('/add-department',addDepartment);
router.put('/edit-department/:id',editDepartment);
router.delete('/delete-department/:id',deleteDepartment);

//  task ข้อมูลงานทั้งหมด
router.get('/tasks',getTasks);
router.post('/add-task',addTask);
router.put('/edit-task/:id',editTask);
router.delete('/delete-task/:id',deleteTask);

//แสดงตารางเวลา
router.post('/add-schedule',addSchedule);
router.put('/edit-schedule/:id',editSchedule);

//เกี่ยวกับการตั้งค่า
router.post('/save-setting',saveSetting);
router.put('/edit-setting',editSetting);

//เกี่ยวกับการแจ้งเตือน
router.get('/notification',getNotifications);
    
// เกี่ยวกับรายงาน
router.get('/data-report',getReports)

module.exports = router;