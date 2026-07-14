const express = require('express');
const {
  createReservation,
  listReservations,
  getReservation,
  updateReservation,
  cancelReservation,
  updateReservationStatus,
  listReservationCustomers,
  createReservationCustomer,
} = require('../controllers/reservationController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();
const { reservationCreateLimiter } = require('../middleware/rateLimiters');

router.get('/', authenticate, listReservations);
router.get('/customers/options', authenticate, authorize(['admin', 'gestor']), listReservationCustomers);
router.post('/customers', authenticate, authorize(['admin', 'gestor']), createReservationCustomer);
router.get('/:id', authenticate, getReservation);
router.post('/', authenticate, reservationCreateLimiter, createReservation);
router.put('/:id', authenticate, updateReservation);
router.patch('/:id/cancel', authenticate, cancelReservation);
router.patch('/:id/status', authenticate, authorize(['admin', 'gestor']), updateReservationStatus);

module.exports = router;
