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

bookingSchema.index(
  { theatreName: 1, bookingDate: 1, showTime: 1, selectedSeats: 1 },
  { unique: true, name: 'unique_seat_per_show' }
);

module.exports = mongoose.model('Booking', bookingSchema);