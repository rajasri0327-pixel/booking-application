const Booking = require('../models/Booking');
const Theatre = require('../models/Theatre');

const DEFAULT_SEAT_PRICE = 150;
const DEFAULT_SEATING_CAPACITY = 30;

const respondWithError = (res, error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: 'One or more selected seats have already been booked'
    });
  }

  return res.status(500).json({ message: error.message });
};

exports.createBooking = async (req, res) => {
  try {
    const {
      movieName,
      theatreName,
      showTime,
      selectedSeats,
      bookingDate
    } = req.body;
    const parsedBookingDate = typeof bookingDate === 'string'
      ? new Date(`${bookingDate}T00:00:00.000Z`)
      : null;

    if (
      typeof movieName !== 'string' || !movieName.trim() ||
      typeof theatreName !== 'string' || !theatreName.trim() ||
      typeof showTime !== 'string' || !showTime.trim() ||
      typeof bookingDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(bookingDate) ||
      Number.isNaN(parsedBookingDate.getTime()) ||
      parsedBookingDate.toISOString().slice(0, 10) !== bookingDate
    ) {
      return res.status(400).json({ message: 'Invalid booking details' });
    }

    if (
      !Array.isArray(selectedSeats) ||
      selectedSeats.length === 0 ||
      !selectedSeats.every(seat => typeof seat === 'string' && /^S[1-9]\d*$/.test(seat)) ||
      new Set(selectedSeats).size !== selectedSeats.length
    ) {
      return res.status(400).json({ message: 'Select one or more valid, unique seats' });
    }

    const normalizedTheatreName = theatreName.trim();
    const normalizedShowTime = showTime.trim();
    const theatre = await Theatre.findOne({ name: normalizedTheatreName });
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    if (theatre.shows.length && !theatre.shows.includes(normalizedShowTime)) {
      return res.status(400).json({ message: 'Show time is not available at this theatre' });
    }

    const seatingCapacity = theatre.seatingCapacity ?? DEFAULT_SEATING_CAPACITY;
    if (selectedSeats.some(seat => Number(seat.slice(1)) > seatingCapacity)) {
      return res.status(400).json({ message: 'One or more selected seats do not exist' });
    }

    const pricePerSeat = theatre.pricePerSeat ?? DEFAULT_SEAT_PRICE;
    if (!Number.isFinite(pricePerSeat) || pricePerSeat < 0) {
      return res.status(500).json({ message: 'Theatre ticket price is invalid' });
    }

    const totalAmount = selectedSeats.length * pricePerSeat;

    // Ensure the unique seat index is ready before accepting a booking.
    await Booking.init();

    const booking = await Booking.create({
      userId: req.user.id,
      movieName: movieName.trim(),
      theatreName: theatre.name,
      showTime: normalizedShowTime,
      selectedSeats,
      totalAmount,
      bookingDate
    });

    res.status(201).json(booking);
  } catch (error) {
    respondWithError(res, error);
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (error) {
    respondWithError(res, error);
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('userId', 'name email');
    res.json(bookings);
  } catch (error) {
    respondWithError(res, error);
  }
};

exports.cancelBooking = async (req, res) => {
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

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    respondWithError(res, error);
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
    respondWithError(res, error);
  }
};