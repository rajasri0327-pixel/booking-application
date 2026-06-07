const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieName: { type: String, required: true },
  theatreName: { type: String, required: true },
  showTime: { type: String, required: true },
  selectedSeats: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
  bookingDate: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);