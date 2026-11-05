import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTheatres } from '../services/apiFixed';

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

const TheatreManagement = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [theatres, setTheatres] = useState([]);
  const movie = state?.movie;

  useEffect(() => {
    if (!movie) {
      navigate('/');
      return;
    }

    getTheatres()
      .then(({ data }) => setTheatres(data))
      .catch((err) => console.error(err));
  }, [movie, navigate]);

  return (
    <div className="container my-5" style={{ minHeight: '85vh' }}>

      {/* Movie Details Panel */}
      <div className="d-flex align-items-center mb-5 bg-custom-dark p-4 rounded shadow border border-secondary" style={{ backgroundColor: '#161b22' }}>
        <img
          src={movie?.title ? imageMap[movie.title.trim()] || movie?.poster : movie?.poster}
          alt={movie?.title}
          style={{
            width: '160px',
            height: '220px',
            objectFit: 'cover',
            borderRadius: '12px'
          }}
          className="me-4 shadow"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';
          }}
        />

        <div>
          <h2 className="fw-bold mb-2 text-primary-color">
            {movie?.title}
          </h2>
          <p className="mb-2 text-muted">
            {movie?.language} • {movie?.genre} • {movie?.duration}
          </p>
          <p className="text-warning mb-0">
            ⭐ {movie?.rating}/10
          </p>
        </div>
      </div>

      {/* Theatre Selection Section */}
      <h4 className="mb-4 fw-bold text-white">Select Theater & Timings</h4>
      <div className="d-flex flex-column gap-3">
        {theatres.map((theatre) => (
          <div
            key={theatre._id}
            className="card text-white border-secondary p-4 shadow rounded d-flex flex-md-row justify-content-between align-items-md-center gap-3"
            style={{ backgroundColor: '#161b22' }}
          >
            <div>
              <h5 className="fw-bold mb-1 text-white">{theatre.name}</h5>
              <p className="text-muted small mb-0">{theatre.location}</p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {theatre.shows.map((time, idx) => (
                <button
                  key={idx}
                  className="btn btn-outline-danger btn-sm px-3 py-2 fw-semibold"
                  onClick={() =>
                    navigate('/seats', {
                      state: { movie, theatre, showTime: time }
                    })
                  }
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TheatreManagement;