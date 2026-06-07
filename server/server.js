const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const userRoutes = require('./routes/userRouters');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors({ origin: '*' })); // Allows cross-origin requests from your React client (Port 3000/3001)
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cinebook_db')
  .then(() => console.log('Successfully Connected to MongoDB Instance'))
  .catch((err) => console.error('MongoDB Initialization Error:', err));

// --- SAFE ROUTE INTEGRATION ---
// Corrects the 'argument handler must be a function' Express routing crash.
const router = express.Router();

// GET: Fetch all seeded movie elements
router.get('/movies', async (req, res) => {
  try {
    const moviesList = await Movie.find({});
    res.status(200).json(moviesList);
  } catch (error) {
    res.status(500).json({ error: "Failed to read movie data from database collection" });
  }
});

// GET: Fetch all theater location documents
router.get('/theatres', async (req, res) => {
  try {
    const theatresList = await Theatre.find({});
    res.status(200).json(theatresList);
  } catch (error) {
    res.status(500).json({ error: "Failed to read theater configurations" });
  }
});

// Mount our router onto the '/api' namespace prefix safely
app.use('/api', router);

// Mount user and booking routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

// Global Error Catch Hook
app.use((err, req, res, next) => {
  console.error("Unhandled Global Server Error Middleware:", err.stack);
  res.status(500).send({ error: 'Internal Server Error Encountered' });
});

// Start listening for client application inquiries
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CineBook Backend Engine actively running on destination port: ${PORT}`);
});