const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cinebook_db');

const initialMovies = [
  { title: "Leo", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500", genre: "Action/Thriller", language: "Tamil", duration: "2h 44m", rating: 8.5, isComingSoon: false },
  { title: "Jailer", poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500", genre: "Action/Drama", language: "Tamil", duration: "2h 48m", rating: 8.9, isComingSoon: false },
  { title: "GOAT", poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500", genre: "Sci-Fi/Action", language: "Tamil", duration: "2h 55m", rating: 8.2, isComingSoon: false },
  { title: "Coolie", poster: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=500", genre: "Action/Crime", language: "Tamil", duration: "2h 40m", rating: 9.0, isComingSoon: false },
  { title: "Thug Life", poster: "https://images.unsplash.com/photo-1574267431647-c82ece31766b?w=500", genre: "Action/Gangster", language: "Tamil", duration: "2h 35m", rating: 8.7, isComingSoon: false },
  { title: "Vidamuyarchi", poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500", genre: "Action/Thriller", language: "Tamil", duration: "2h 30m", rating: 7.9, isComingSoon: false },
  { title: "Dragon", poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500", genre: "Fantasy/Action", language: "English", duration: "2h 15m", rating: 8.1, isComingSoon: false },
  { title: "Retro", poster: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=500", genre: "Drama/Mystery", language: "English", duration: "2h 10m", rating: 7.5, isComingSoon: false },
  { title: "Good Bad Ugly", poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500", genre: "Comedy/Action", language: "Tamil", duration: "2h 42m", rating: 8.3, isComingSoon: false },
  { title: "Kuberaa", poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500", genre: "Mythology/Drama", language: "Telugu", duration: "2h 50m", rating: 8.6, isComingSoon: false },
  { title: "HIT 3", poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500", genre: "Suspense/Thriller", language: "Telugu", duration: "2h 25m", rating: 8.4, isComingSoon: false },
  { title: "Tourist Family", poster: "https://images.unsplash.com/photo-1512257899767-42348b48995c?w=500", genre: "Comedy/Drama", language: "Malayalam", duration: "2h 18m", rating: 7.8, isComingSoon: false },
  
  // 🎥 NEW Coming Soon Lineup for September 2026
  { 
    title: "Karthi 29", 
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500", 
    genre: "Action/Drama", 
    language: "Tamil", 
    duration: "N/A", 
    rating: 0, 
    releaseDate: "September 2026", 
    isComingSoon: true 
  },
  { 
    title: "Dhanush Next", 
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500", 
    genre: "Drama", 
    language: "Tamil", 
    duration: "N/A", 
    rating: 0, 
    releaseDate: "September 2026", 
    isComingSoon: true 
  },
  { 
    title: "Lokesh Universe", 
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500", 
    genre: "Action/Thriller", 
    language: "Tamil", 
    duration: "N/A", 
    rating: 0, 
    releaseDate: "September 2026", 
    isComingSoon: true 
  },
  { 
    title: "Project K Universe", 
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500", 
    genre: "Sci-Fi/Action", 
    language: "Telugu", 
    duration: "N/A", 
    rating: 0, 
    releaseDate: "September 2026", 
    isComingSoon: true 
  },
  { 
    title: "Suriya 45", 
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500", 
    genre: "Action/Fantasy", 
    language: "Tamil", 
    duration: "N/A", 
    rating: 0, 
    releaseDate: "September 2026", 
    isComingSoon: true 
  }
];

const initialTheatres = [
  { name: "PVR Cinemas", location: "Velachery, Chennai", shows: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"] },
  { name: "INOX", location: "Virugambakkam, Chennai", shows: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"] },
  { name: "AGS Cinemas", location: "T Nagar, Chennai", shows: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"] },
  { name: "Rohini Silver Screens", location: "Koyambedu, Chennai", shows: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"] },
  { name: "Escape Cinemas", location: "Royapettah, Chennai", shows: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"] },
  { name: "SPI Palazzo", location: "Vadapalani, Chennai", shows: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"] },
  { name: "Kamala Cinemas", location: "Vadapalani, Chennai", shows: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"] },
  { name: "Vettri Theatre", location: "Chromepet, Chennai", shows: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"] },
  { name: "Gokulam Cinemas", location: "Ambattur, Chennai", shows: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"] },
  { name: "Devi Theatre", location: "Anna Salai, Chennai", shows: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"] }
];

const seedData = async () => {
  try {
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Movie.insertMany(initialMovies);
    await Theatre.insertMany(initialTheatres);
    console.log("Database Seeded Successfully!");
  } catch (error) {
    console.error("Seeding Error:", error);
  } finally {
    process.exit();
  }
};

seedData();