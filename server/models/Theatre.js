const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  shows: [{ type: String }],
  seatingCapacity: { type: Number, required: true, min: 1, default: 30 },
  pricePerSeat: { type: Number, required: true, min: 0, default: 150 }
}, { timestamps: true });

module.exports = mongoose.model('Theatre', theatreSchema);