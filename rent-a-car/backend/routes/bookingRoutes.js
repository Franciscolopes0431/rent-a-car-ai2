const express = require('express');
const {
  listBookings,
  getBooking,
  createBooking,
  updateBooking,
  changeBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');

const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, listBookings);
router.get('/:id', authenticate, getBooking);
router.post('/', authenticate, createBooking);
router.put('/:id', authenticate, updateBooking);
router.patch('/:id/status', authenticate, changeBookingStatus);
router.delete('/:id', authenticate, cancelBooking);

module.exports = router;
