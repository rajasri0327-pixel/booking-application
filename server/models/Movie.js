const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String, required: true },
  genre: { type: String, required: true },
  language: { type: String, required: true },
  duration: { type: String, required: true },
  rating: { type: Number, required: true },
  releaseDate: { type: String },
  isComingSoon: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);