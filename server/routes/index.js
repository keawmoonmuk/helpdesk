const express = require('express');
const router = express.Router();

//import all routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const technicianRoutes = require('./technicianRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/technicians', technicianRoutes);
router.use('/admin', adminRoutes);      

module.exports = router;