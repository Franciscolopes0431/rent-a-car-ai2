const express = require('express');
const {
  getRevenueReport,
  getBookingsByStatus,
  getTopVehicles,
  getTopCustomers,
  getFleetUtilization,
} = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/revenue', authenticate, authorize(['admin', 'gestor']), getRevenueReport);
router.get('/bookings-by-status', authenticate, authorize(['admin', 'gestor']), getBookingsByStatus);
router.get('/top-vehicles', authenticate, authorize(['admin', 'gestor']), getTopVehicles);
router.get('/top-customers', authenticate, authorize(['admin', 'gestor']), getTopCustomers);
router.get('/fleet-utilization', authenticate, authorize(['admin', 'gestor']), getFleetUtilization);

module.exports = router;