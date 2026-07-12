const express = require('express');
const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const reservationRoutes = require('./reservationRoutes');
const vehicleRoutes = require('./vehicleRoutes');
const customerRoutes = require('./customerRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const reportRoutes = require('./reportRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/reservations', reservationRoutes);
router.use('/customers', customerRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
