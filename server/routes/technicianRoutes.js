const express = require('express');
const router = express.Router();

const {listTechnicians, addTechnician, editTechnician,deleteTechnician} = require('../controllers/technicianController');

const {getNotifications} = require('../controllers/technician/notificationController');
const {getRepairs,repairOutside} = require('../controllers/technician/repairController');
const {getReports} = require('../controllers/technician/reportController');
const {addSchedule,editSchedule} = require('../controllers/technician/scheduleController');
const {saveSetting,editSetting,getSettings} = require('../controllers/technician/settingController');
const {getTasks,addTask,editTask,deleteTask} = require('../controllers/technician/taskController');

router.get('/', listTechnicians); //ดึงรายชื่อช่างทั้งหมด
router.post('/add', addTechnician); // เพิ่มช่างซ่อม
router.put('/edit/:id', editTechnician); //แก้ไขช่างซ่อม
router.delete('/delete/:id', deleteTechnician); //ลบช่างซ่อม


// เกี่ยวกับ dashboard
router.get('repairs',getRepairs);  //ดึงข้อมูลการซ่อมทั้งหมด
router.get('repair-outside',repairOutside);  //ซ่อมภายนอก

// เกี่ยวกับ task งานด่วน 
router.get('tasks',getTasks);
router.post('add-task',addTask);
router.put('edit-task/:id',editTask);
router.delete('delete-task/:id',deleteTask);

//แสดงตารางเวลา
router.post('add-schedule',addSchedule)
router.put('edit-schedule',editSchedule)


//เกี่ยวกับการตั้งค่า
router.get('get-setting',saveSetting);
router.post('save-setting',saveSetting);
router.put('edit-setting/:id',editSetting);

//เกี่ยวกับการแจ้งเตือน
router.get('notification',getNotifications);

// เกี่ยวกับรายงาน
router.put('data-repair',getReports);

module.exports = router;