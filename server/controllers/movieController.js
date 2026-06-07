const Movie = require('../models/Movie');

exports.getMovies = async (req, res) => {
  try { res.json(await Movie.find({})); } 
  catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createMovie = async (req, res) => {
  try { res.status(201).json(await Movie.create(req.body)); } 
  catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(movie);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};