const express = require('express');
const {
  listBookings,
  getBooking,
  createBooking,
  updateBooking,
  changeBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');

const router = express.Router();

router.get('/', listBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.patch('/:id/status', changeBookingStatus);
router.delete('/:id', cancelBooking);

module.exports = router;
