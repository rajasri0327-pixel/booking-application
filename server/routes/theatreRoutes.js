const express = require('express');
const router = express.Router();
const { getTheatres, createTheatre } = require('../controllers/theatreController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getTheatres).post(protect, admin, createTheatre);

module.exports = router;