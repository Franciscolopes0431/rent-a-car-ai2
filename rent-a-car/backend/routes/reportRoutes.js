const express = require('express');
const {
  getRevenueReport,
  getBookingsByStatus,
  getTopVehicles,
  getTopCustomers,
  getFleetUtilization,
} = require('../controllers/reportController');

const router = express.Router();

router.get('/revenue', getRevenueReport);
router.get('/bookings-by-status', getBookingsByStatus);
router.get('/top-vehicles', getTopVehicles);
router.get('/top-customers', getTopCustomers);
router.get('/fleet-utilization', getFleetUtilization);

module.exports = router;