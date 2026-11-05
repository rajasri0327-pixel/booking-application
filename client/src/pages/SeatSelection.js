import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBookedSeats, createBooking } from '../services/apiFixed';

const SeatSelection = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Extract data from navigation state
  const { movie, theatre, showTime } = state || {};
  const theatreName = theatre?.name || '';
  const movieName = movie?.title || '';
  const totalSeats = theatre?.seatingCapacity || 30;
  const pricePerSeat = theatre?.pricePerSeat || 150;

  // Get booking date (today's date for now)
  const bookingDate = new Date().toISOString().split('T')[0];

  // Local state for seat management
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  // Get user from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch {
      return null;
    }
  })();

  // Redirect if missing essential data
  useEffect(() => {
    if (!movie || !theatre || !showTime) {
      navigate('/');
    }
  }, [movie, theatre, showTime, navigate]);

  // ── Fetch already-booked seats for this show ──────────────────────────────
  useEffect(() => {
    if (!theatreName || !bookingDate || !showTime) return;

    setLoading(true);
    setError('');

    getBookedSeats({ theatreName, bookingDate, showTime })
      .then(({ data }) => {
        console.log('Booked seats response:', data);
        setBookedSeats(Array.isArray(data.bookedSeats) ? data.bookedSeats : []);
      })
      .catch(err => {
        console.error('Seat fetch error:', err);
        setError('Could not load seat data. Please refresh.');
        setBookedSeats([]);
      })
      .finally(() => setLoading(false));
  }, [theatreName, bookingDate, showTime]);

  // ── Toggle a seat on/off ──────────────────────────────────────────────────
  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return; // already booked → ignore click

    setSelectedSeats(prev =>
      prev.includes(seat)
        ? prev.filter(s => s !== seat) // deselect
        : [...prev, seat] // select
    );
  };

  // ── Confirm booking ───────────────────────────────────────────────────────
  const handleBook = async () => {
    if (!selectedSeats.length) return alert('Please select at least one seat.');
    if (!user?._id) return alert('Please login first.');

    setBooking(true);
    try {
      await createBooking({
        userId: user._id,
        movieName,
        theatreName,
        bookingDate,
        showTime,
        selectedSeats,
        totalAmount: selectedSeats.length * pricePerSeat,
      });

      alert(`🎫 Booking confirmed!\nSeats: ${selectedSeats.join(', ')}`);
      // Mark newly booked seats as unavailable immediately in UI
      setBookedSeats(prev => [...prev, ...selectedSeats]);
      setSelectedSeats([]);
      navigate('/my-bookings');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert('Booking failed: ' + msg);
    } finally {
      setBooking(false);
    }
  };

  // ── Seat status helper ────────────────────────────────────────────────────
  const seatStatus = (seat) => {
    if (bookedSeats.includes(seat)) return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  const seatStyle = (status) => {
    const base = {
      width: 42, height: 42, margin: 4, borderRadius: 6,
      border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer',
      transition: 'all 0.2s',
    };
    if (status === 'booked') return { ...base, background: '#555', color: '#888', cursor: 'not-allowed' };
    if (status === 'selected') return { ...base, background: '#e63946', color: '#fff' };
    return { ...base, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' };
  };

  const allSeats = Array.from({ length: totalSeats }, (_, i) => `S${i + 1}`);

  // Loading state
  if (loading) return (
    <div className="text-center my-5" style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="spinner-border text-danger" />
      <p className="text-muted mt-3">Loading seat availability...</p>
    </div>
  );

  // Error state
  if (error) return (
    <div style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <p className="text-danger text-center my-5">{error}</p>
      <div className="text-center">
        <button className="btn btn-danger" onClick={() => navigate('/theatres')}>
          Back to Theatre Selection
        </button>
      </div>
    </div>
  );

  // Missing data state
  if (!movie || !theatre || !showTime) {
    return (
      <div style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p className="text-danger text-center my-5">No show data available. Please select a show first.</p>
        <div className="text-center">
          <button className="btn btn-danger" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="container my-5" style={{ minHeight: '85vh', backgroundColor: '#0d1117', color: '#fff' }}>
      <h4 className="fw-bold mb-1">{movieName}</h4>
      <p className="text-muted mb-4">{theatreName} · {bookingDate} · {showTime}</p>

      {/* Screen indicator */}
      <div style={{
        background: 'linear-gradient(to bottom, #e63946, transparent)',
        height: 6, borderRadius: 4, marginBottom: 32, opacity: 0.7,
      }} />
      <p className="text-center text-muted small mb-4" style={{ letterSpacing: 6 }}>SCREEN</p>

      {/* Seat grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 420, margin: '0 auto' }}>
        {allSeats.map(seat => {
          const status = seatStatus(seat);
          return (
            <button
              key={seat}
              style={seatStyle(status)}
              onClick={() => toggleSeat(seat)}
              disabled={status === 'booked'}
              title={status === 'booked' ? 'Already booked' : seat}
            >
              {seat}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="d-flex justify-content-center gap-4 my-4">
        {[
          { color: '#1e293b', border: '1px solid #334155', label: 'Available' },
          { color: '#e63946', label: 'Selected' },
          { color: '#555', label: 'Booked' },
        ].map(({ color, border, label }) => (
          <div key={label} className="d-flex align-items-center gap-2">
            <div style={{ width: 18, height: 18, background: color, border, borderRadius: 4 }} />
            <span className="small text-muted">{label}</span>
          </div>
        ))}
      </div>

      {/* Summary & Book button */}
      {selectedSeats.length > 0 && (
        <div className="text-center mt-3">
          <p className="mb-1">
            Selected: <span className="text-warning fw-bold">{selectedSeats.join(', ')}</span>
          </p>
          <p className="mb-3">
            Total: <span className="fw-bold">₹{selectedSeats.length * pricePerSeat}</span>
          </p>
          <button
            className="btn btn-danger px-5"
            onClick={handleBook}
            disabled={booking}
          >
            {booking
              ? <><span className="spinner-border spinner-border-sm me-2" />Booking...</>
              : `Confirm Booking (${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''})`
            }
          </button>
        </div>
      )}

      {/* Back button */}
      <div className="text-center mt-5">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/theatres', { state: { movie } })}>
          Back to Theatre Selection
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;