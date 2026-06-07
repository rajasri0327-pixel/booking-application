const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const {
      movieName,
      theatreName,
      showTime,
      selectedSeats,
      totalAmount,
      bookingDate
    } = req.body;

    const booking = await Booking.create({
      userId: req.user.id,
      movieName,
      theatreName,
      showTime,
      selectedSeats,
      totalAmount,
      bookingDate
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('userId', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  console.log('🔥 CANCEL ROUTE HIT');
  console.log('Booking ID:', req.params.id);
  console.log('User from token:', req.user);

  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    const isOwner = booking.userId.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'You are not authorized to cancel this booking'
      });
    }

    await Booking.findByIdAndDelete(bookingId);

    console.log('✅ Booking deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('❌ Cancel booking error:', error);

    res.status(500).json({
      message: error.message
    });
  }
};

exports.getBookedSeats = async (req, res) => {
  try {
    const { theatreName, bookingDate, showTime } = req.query;

    const bookings = await Booking.find({
      theatreName,
      bookingDate,
      showTime
    });

    const bookedSeats = bookings.flatMap(
      booking => booking.selectedSeats || []
    );

    res.json({ bookedSeats });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      bookedSeats: []
    });
  }
};