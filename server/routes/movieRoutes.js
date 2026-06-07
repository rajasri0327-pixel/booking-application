const express = require('express');
const router = express.Router();
const { getMovies, createMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getMovies).post(protect, admin, createMovie);
router.route('/:id').put(protect, admin, updateMovie).delete(protect, admin, deleteMovie);

module.exports = router;