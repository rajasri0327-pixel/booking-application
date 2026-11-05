import React, { useState, useEffect } from 'react';
import { getMovies, addMovie, deleteMovie, getTheatres, fetchUsers, getAllBookings } from '../services/apiFixed';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Initial clean state structure for form resets
  const initialMovieState = { 
    title: '', 
    poster: '', 
    genre: '', 
    language: '', 
    duration: '', 
    rating: 8.0, 
    isComingSoon: false 
  };

  const [newMovie, setNewMovie] = useState(initialMovieState);

  useEffect(() => {
    getMovies()
      .then(({ data }) => setMovies(data))
      .catch(err => console.error("Error fetching movies:", err));

    getTheatres()
      .then(({ data }) => setTheatres(data))
      .catch(err => console.error("Error fetching theatres:", err));

    fetchUsers()
      .then(({ data }) => setUsers(data))
      .catch(err => console.error("Error fetching users:", err));

    getAllBookings()
      .then(({ data }) => setBookings(data))
      .catch(err => console.error("Error fetching bookings:", err));
  }, []);

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addMovie(newMovie);
      setMovies([...movies, data]);
      alert("Movie addition completed!");
      setNewMovie(initialMovieState); // FIX: Safely resets all input fields to blank
    } catch (error) {
      console.error("Error adding movie:", error);
      alert(error.response?.data?.message || "Failed to upload movie entry.");
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm("Delete this movie listing?")) {
      try {
        await deleteMovie(id);
        setMovies(movies.filter(m => m._id !== id));
      } catch (error) {
        console.error("Error deleting movie:", error);
        alert("Failed to delete movie listing.");
      }
    }
  };

  return (
    <div className="container my-5">
      <h1 className="fw-bold mb-5 text-primary-color">Master Control Dashboard</h1>

      {/* Metrics Row */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card bg-custom-dark border-secondary p-3 text-center text-white">
            <h3>{movies.length}</h3><p className="text-muted mb-0">Total Movies Hosted</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-custom-dark border-secondary p-3 text-center text-white">
            <h3>{theatres.length}</h3><p className="text-muted mb-0">Active Venues</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-custom-dark border-secondary p-3 text-center text-white">
            <h3>{bookings.length}</h3><p className="text-muted mb-0">Total Bookings Managed</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Form to insert new movie assets */}
        <div className="col-lg-4">
          <div className="card bg-custom-dark border-secondary p-4 rounded text-white">
            <h4 className="fw-bold mb-3 text-primary-color">Add New Movie Asset</h4>
            <form onSubmit={handleMovieSubmit}>
              <div className="mb-2">
                <input 
                  type="text" 
                  placeholder="Title" 
                  className="form-control form-control-sm bg-dark text-white border-secondary" 
                  value={newMovie.title} // FIX: Controlled Binding
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })} 
                  required 
                />
              </div>
              <div className="mb-2">
                <input 
                  type="text" 
                  placeholder="Poster Image URL" 
                  className="form-control form-control-sm bg-dark text-white border-secondary" 
                  value={newMovie.poster} // FIX: Controlled Binding
                  onChange={(e) => setNewMovie({ ...newMovie, poster: e.target.value })} 
                  required 
                />
              </div>
              <div className="mb-2">
                <input 
                  type="text" 
                  placeholder="Genre" 
                  className="form-control form-control-sm bg-dark text-white border-secondary" 
                  value={newMovie.genre} // FIX: Controlled Binding
                  onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })} 
                  required 
                />
              </div>
              <div className="mb-2">
                <input 
                  type="text" 
                  placeholder="Language" 
                  className="form-control form-control-sm bg-dark text-white border-secondary" 
                  value={newMovie.language} // FIX: Controlled Binding
                  onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })} 
                  required 
                />
              </div>
              <div className="mb-2">
                <input 
                  type="text" 
                  placeholder="Duration (e.g. 2h 30m)" 
                  className="form-control form-control-sm bg-dark text-white border-secondary" 
                  value={newMovie.duration} // FIX: Controlled Binding
                  onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })} 
                  required 
                />
              </div>
              <div className="mb-3 d-flex gap-2 text-white align-items-center">
                <input 
                  type="checkbox" 
                  id="soon" 
                  checked={newMovie.isComingSoon} // FIX: Controlled Binding
                  onChange={(e) => setNewMovie({ ...newMovie, isComingSoon: e.target.checked })} 
                />
                <label htmlFor="soon" className="small">Set as Coming Soon</label>
              </div>
              <button type="submit" className="btn btn-danger btn-sm w-100">Upload Entry</button>
            </form>
          </div>
        </div>

        {/* Existing Data Tables */}
        <div className="col-lg-8">
          {/* Live Inventory */}
          <div className="card bg-custom-dark border-secondary p-4 rounded text-white mb-4">
            <h5 className="fw-bold mb-3">Live Inventory</h5>
            <div className="table-responsive" style={{ maxHeight: '250px' }}>
              <table className="table table-dark table-striped table-hover align-middle small">
                <thead>
                  <tr><th>Title</th><th>Language</th><th>Genre</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {movies.map(m => (
                    <tr key={m._id}>
                      <td>{m.title}</td><td>{m.language}</td><td>{m.genre}</td>
                      <td><button className="btn btn-sm btn-danger py-0" onClick={() => handleDeleteMovie(m._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Registered Users Stack */}
          <div className="card bg-custom-dark border-secondary p-4 rounded text-white mb-4">
            <h5 className="fw-bold mb-3">Registered Users Stack</h5>
            <div className="table-responsive" style={{ maxHeight: '200px' }}>
              <table className="table table-dark table-striped table-hover align-middle small">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>{u.role}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FIX: New Active Customer Bookings Log */}
          <div className="card bg-custom-dark border-secondary p-4 rounded text-white">
            <h5 className="fw-bold mb-3">Active Customer Bookings</h5>
            <div className="table-responsive" style={{ maxHeight: '250px' }}>
              <table className="table table-dark table-striped table-hover align-middle small">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Movie / Theatre</th>
                    <th>Show Details</th>
                    <th>Seats</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td>
                        <div className="fw-bold">{b.userId?.name || 'Unknown User'}</div>
                        <div className="text-muted small">{b.userId?.email || 'N/A'}</div>
                      </td>
                      <td>
                        <div className="fw-bold text-primary-color">{b.movieName}</div>
                        <div className="text-muted small">{b.theatreName}</div>
                      </td>
                      <td>
                        <div>{b.bookingDate}</div>
                        <div className="text-muted small">{b.showTime}</div>
                      </td>
                      <td>
                        <span className="badge bg-warning text-dark">{b.selectedSeats?.join(', ')}</span>
                      </td>
                      <td className="fw-bold text-success">₹{b.totalAmount}</td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-3">No bookings logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;