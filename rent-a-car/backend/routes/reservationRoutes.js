const express = require('express');
const {
  createReservation,
  listReservations,
  updateReservationStatus,
} = require('../controllers/reservationController');

const router = express.Router();

router.get('/', listReservations);
router.post('/', createReservation);
router.patch('/:id/status', updateReservationStatus);

module.exports = router;