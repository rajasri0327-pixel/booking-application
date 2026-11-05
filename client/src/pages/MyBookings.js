import React, { useState, useEffect, useCallback } from 'react';
import { getUserBookings, cancelBooking } from '../services/apiFixed';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch {
      return null;
    }
  });

  // FIX: Call getUserBookings() directly. The backend securely identifies the user via their token payload.
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getUserBookings(); 
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert("Failed to load bookings: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [fetchBookings, user]);

  const handleCancel = async (id) => {
    console.log('=== CANCEL BOOKING START ===');
    console.log('Booking ID:', id);
    console.log('User:', user);
    
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      setCancellingId(id);
      try {
        console.log('Calling cancelBooking API with ID:', id);
        const response = await cancelBooking(id);
        console.log('✓ Cancel API response:', response);
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        
        // Remove the booking from the list immediately
        setBookings(prev => {
          const updated = prev.filter(b => b._id !== id);
          console.log('Bookings before:', prev.length, 'Bookings after:', updated.length);
          return updated;
        });
        
        alert("✅ Booking cancelled successfully!");
        
        // Refresh the bookings list to ensure data is fresh
        setTimeout(() => {
          console.log('Refreshing bookings list...');
          fetchBookings();
        }, 500);
      } catch (err) {
        console.error('❌ Cancel error details:');
        console.error('Error object:', err);
        console.error('Status:', err.response?.status);
        console.error('Response data:', err.response?.data);
        console.error('Message:', err.message);
        
        const errorMsg = err.response?.data?.message || err.message || "Failed to cancel booking.";
        alert("❌ " + errorMsg);
        
        // Refresh bookings in case something went wrong
        console.log('Refreshing due to error...');
        fetchBookings();
      } finally {
        setCancellingId(null);
        console.log('=== CANCEL BOOKING END ===');
      }
    } else {
      console.log('User cancelled the confirmation dialog');
    }
  };

  const isExpired = (booking) => {
    try {
      const showDateTime = new Date(`${booking.bookingDate} ${booking.showTime.split(' - ')[0] || booking.showTime}`);
      return showDateTime < new Date();
    } catch {
      return false;
    }
  };

  const downloadTicket = (booking) => {
    alert(`Downloading Ticket for ${booking.movieName}\nSeats: ${booking.selectedSeats.join(', ')}`);
  };

  if (!user) {
    return <div className="container my-5 text-center text-white">Please login to view history.</div>;
  }

  return (
    <div className="container my-5 text-white" style={{ minHeight: '75vh' }}>
      <h2 className="fw-bold mb-4 text-primary-color">My Booking History</h2>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-danger" role="status"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center my-5 py-5 bg-custom-dark rounded border border-secondary">
          <p className="text-muted mb-0">You haven't reserved any tickets yet.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {bookings.map((b) => (
            <div className="col" key={b._id}>
              <div className="card bg-custom-dark text-white border-secondary h-100 p-3 d-flex flex-column justify-content-between">
                <div>
                  <h4 className="fw-bold text-primary-color mb-1">{b.movieName}</h4>
                  <p className="text-muted small mb-3">{b.theatreName}</p>
                  <hr className="border-secondary my-2" />
                  <p className="mb-1 small text-muted">Date: <span className="text-white fw-semibold">{b.bookingDate}</span></p>
                  <p className="mb-1 small text-muted">Time: <span className="text-white fw-semibold">{b.showTime}</span></p>
                  <p className="mb-1 small text-muted">Seats: <span className="text-warning fw-semibold">{b.selectedSeats.join(', ')}</span></p>
                  <p className="mb-1 small text-muted">Paid Amount: <span className="text-success fw-bold">₹{b.totalAmount}</span></p>
                  {isExpired(b) && <span className="badge bg-warning text-dark mt-2">Show Completed</span>}
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-outline-light btn-sm flex-grow-1" onClick={() => downloadTicket(b)}>Download Ticket</button>
                  <button className="btn btn-danger btn-sm px-3" onClick={() => handleCancel(b._id)} disabled={isExpired(b) || cancellingId === b._id}>
                    {cancellingId === b._id ? <span className="spinner-border spinner-border-sm" /> : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;