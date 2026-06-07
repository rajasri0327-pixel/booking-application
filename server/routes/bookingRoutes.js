const express = require('express');
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
  getBookedSeats
} = require('../controllers/bookingController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.get('/mine', protect, getUserBookings);

router.get('/booked-seats', getBookedSeats);

router.delete('/:id', protect, cancelBooking);

module.exports = router;