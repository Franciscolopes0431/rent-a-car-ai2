const bookingService = require('../services/bookingService');
const { validateBookingPayload } = require('../validators/bookingValidator');

async function listBookings(req, res, next) {
  try {
    const result = await bookingService.list(req.query);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getBooking(req, res, next) {
  try {
    const booking = await bookingService.findById(req.params.id);
    return res.json(booking);
  } catch (error) {
    return next(error);
  }
}

async function createBooking(req, res, next) {
  try {
    const errors = validateBookingPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const booking = await bookingService.create(req.body);
    return res.status(201).json(booking);
  } catch (error) {
    return next(error);
  }
}

async function updateBooking(req, res, next) {
  try {
    const errors = validateBookingPayload(req.body, true);
    if (errors.length) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const booking = await bookingService.update(req.params.id, req.body);
    return res.json(booking);
  } catch (error) {
    return next(error);
  }
}

async function changeBookingStatus(req, res, next) {
  try {
    const { status } = req.body;
    const booking = await bookingService.changeStatus(req.params.id, status);
    return res.json(booking);
  } catch (error) {
    return next(error);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const booking = await bookingService.cancel(req.params.id);
    return res.json(booking);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listBookings,
  getBooking,
  createBooking,
  updateBooking,
  changeBookingStatus,
  cancelBooking,
};
