import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovies } from '../services/apiFixed';

// Image map using public folder path
const imageMap = {
  // Now Showing
  "Leo": "/images/leo.png",
  "Jailer": "/images/jailer.png",
  "GOAT": "/images/gote.png",
  "Coolie": "/images/coolie.png",
  "Thug Life": "/images/thug-life.png",
  "Vidamuyarchi": "/images/vidaa-muyarchi.png",
  "Vidaa Muyarchi": "/images/vidaa-muyarchi.png",
  "Dragon": "/images/Doragon.png",
  "Retro": "/images/retro.png",
  "Good Bad Ugly": "/images/goodbadugly.jpg",
  "Kuberaa": "/images/kuberaa.png",
  "HIT 3": "/images/HIT-3.png",
  "Tourist Family": "/images/tourist-family.png",

  // Coming Soon (September 2026)
  "Karthi 29": "/images/karthi-29.jpg",
  "Dhanush Next": "/images/dhanush-next.jpg",
  "Lokesh Universe": "/images/lokesh-universe-part-2.jpg",
  "Project K Universe": "/images/project-k-universe.jpg",
  "Suriya 45": "/images/suriya-45.jpg"
};

const bannerImage = "/images/images.jpg";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMovies()
      .then(({ data }) => {
        setMovies(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Frontend Data Fetching Error:", err);
        setLoading(false);
      });
  }, []);

  // Safe search normalization
  const filteredMovies = movies.filter(m => 
    m.title && m.title.toLowerCase().includes(search.toLowerCase())
  );

  // Now Showing Filter
  const regularMovies = filteredMovies.filter(m => m.isComingSoon === false || m.isComingSoon === 'false' || !m.isComingSoon);

  // Trending Section Filter
  const trendingTitles = ["GOAT", "Coolie", "Thug Life", "Kuberaa", "HIT 3"];
  const trendingMovies = filteredMovies.filter(m => m.title && trendingTitles.includes(m.title.trim()) && (!m.isComingSoon || m.isComingSoon === 'false' || m.isComingSoon === false));

  // Coming Soon Section Filter
  const comingSoonMovies = movies.filter(m => m.isComingSoon === true || m.isComingSoon === 'true');

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#0d1117' }}>
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh', color: '#fff' }}>
      
      {/* Hero Banner Slider Carousel */}
      <div id="heroCarousel" className="carousel slide carousel-fade mb-5" data-bs-ride="carousel" data-bs-interval="3000">
        <div className="carousel-inner">
          
          {/* Slide 1: Local Banner Background */}
          <div className="carousel-item active" style={{ 
            height: '500px', 
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(13,17,23,1)), url(${bannerImage}) center/cover no-repeat` 
          }}>
            <div className="container h-100 d-flex align-items-center">
              <div className="text-start w-100 pb-4">
                <span className="badge bg-danger mb-3 px-3 py-2 fs-6">TRENDING 🔥</span>
                <h1 className="display-3 fw-bold text-white mb-2">Superstar Cinema Arrives</h1>
                <p className="text-light fs-5 w-50">Experience the magic of cinema like never before. Book your tickets now for the biggest releases of the year.</p>
              </div>
            </div>
          </div>

          {/* Slide 2: Blockbuster */}
          <div className="carousel-item" style={{ height: '500px', background: `linear-gradient(rgba(0,0,0,0.4), rgba(13,17,23,1)), url(/images/leo.png) center/cover no-repeat` }}>
            <div className="container h-100 d-flex align-items-end pb-5">
              <div>
                <span className="badge bg-danger mb-2 px-3 py-1">BLOCKBUSTER</span>
                <h1 className="display-4 fw-bold text-white">Witness the Ultimate Action</h1>
              </div>
            </div>
          </div>

          {/* Slide 3: Critics Choice */}
          <div className="carousel-item" style={{ height: '500px', background: `linear-gradient(rgba(0,0,0,0.4), rgba(13,17,23,1)), url(/images/thug-life.png) center/cover no-repeat` }}>
            <div className="container h-100 d-flex align-items-end pb-5">
              <div>
                <span className="badge bg-warning text-dark mb-2 px-3 py-1 fw-bold">CRITICS CHOICE</span>
                <h1 className="display-4 fw-bold text-white">Epic Tales Unleashed</h1>
              </div>
            </div>
          </div>
        </div>
        
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      <div className="container my-5">
        
        {/* Search Field */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control form-control-lg bg-dark text-white border-secondary text-center shadow-sm"
              placeholder="🔍 Search for movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: '30px' }}
            />
          </div>
        </div>

        {/* Section 1: Now Showing */}
        <h2 className="mb-4 fw-bold border-start border-danger border-4 ps-2 text-white">Now Showing</h2>
        <div className="row g-4 mb-5">
          {regularMovies.length > 0 ? regularMovies.map((movie) => (
            <div className="col-6 col-md-4 col-lg-3" key={movie._id}>
              <div className="card h-100 border-0 shadow overflow-hidden" style={{ backgroundColor: '#161b22' }}>
                <img
                  src={movie.title ? imageMap[movie.title.trim()] || movie.poster : movie.poster}
                  alt={movie.title}
                  className="card-img-top"
                  style={{ height: '340px', objectFit: 'cover' }}
                  onError={(e) => {
                     e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';
                  }}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title text-white mb-1 fw-bold text-truncate">{movie.title}</h5>
                    <p className="text-muted mb-2 small">{movie.language} • {movie.genre}</p>
                    <div className="d-flex justify-content-between text-warning small mb-3">
                      <span>★ {movie.rating}/10</span>
                      <span>{movie.duration}</span>
                    </div>
                  </div>
                  <button className="btn btn-danger w-100 py-2 fw-semibold" onClick={() => navigate(`/theatres`, { state: { movie } })}>Book Ticket</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-12 text-center text-muted py-4">No active releases matching your filter.</div>
          )}
        </div>

        {/* Section 2: Trending Now */}
        <h2 className="mb-4 fw-bold text-warning border-start border-warning border-4 ps-2">🔥 Trending Now</h2>
        <div className="row g-4 mb-5">
          {trendingMovies.length > 0 ? trendingMovies.map((movie) => (
            <div className="col-6 col-md-4 col-lg-3" key={movie._id}>
              <div className="card h-100 border-0 shadow overflow-hidden" style={{ backgroundColor: '#161b22' }}>
                <img
                  src={movie.title ? imageMap[movie.title.trim()] || movie.poster : movie.poster}
                  alt={movie.title}
                  className="card-img-top"
                  style={{ height: '320px', objectFit: 'cover' }}
                  onError={(e) => {
                     e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';
                  }}
                />
                <div className="card-body">
                  <h6 className="text-white fw-bold text-truncate mb-2">{movie.title}</h6>
                  <button className="btn btn-sm btn-outline-warning w-100" onClick={() => navigate(`/theatres`, { state: { movie } })}>Book Tickets</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-12 text-center text-muted py-4">No trending titles available right now.</div>
          )}
        </div>

        {/* Section 3: Coming Soon Slider Section (September 2026 Layout) */}
        <div className="my-5">
          <h2 className="mb-4 fw-bold text-white">September 2026</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
            {comingSoonMovies.length > 0 ? comingSoonMovies.map((movie) => (
              <div className="col" key={movie._id}>
                <div className="card bg-transparent border-0 h-100">
                  <img
                    src={movie.title ? imageMap[movie.title.trim()] || movie.poster : movie.poster}
                    alt={movie.title}
                    className="card-img-top img-fluid rounded-4 shadow-sm"
                    style={{ aspectRatio: '2/3', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1512257899767-42348b48995c?w=500';
                    }}
                  />
                  <div className="card-body px-0 pt-3">
                    <h5 className="text-white fw-bold fs-6 mb-1 text-truncate" title={movie.title}>
                      {movie.title}
                    </h5>
                    <p className="text-muted small mb-0">
                      {movie.releaseDate || "Coming Soon"}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-12 text-muted py-2">No upcoming releases tracked for this month.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;