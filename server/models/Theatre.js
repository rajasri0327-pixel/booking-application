const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  shows: [{ type: String }] // e.g. ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"]
}, { timestamps: true });

module.exports = mongoose.model('Theatre', theatreSchema);