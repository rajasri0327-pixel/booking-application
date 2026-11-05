import React from 'react';

const Footer = () => {
  return (
    <footer
      className="footer-section text-white mt-auto"
      style={{
        backgroundColor: '#111827',
        borderTop: '1px solid #374151'
      }}
    >
      <div className="container py-5">
        <div className="row">

          {/* Logo & About */}
          <div className="col-md-4 mb-4">
            <h3 className="fw-bold text-danger">CINEBOOK</h3>
            <p className="text-muted">
              Book movie tickets instantly. Explore trending movies,
              select theatres, choose seats and enjoy a seamless
              cinema experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none text-muted">Home</a></li>
              <li><a href="/my-bookings" className="text-decoration-none text-muted">My Bookings</a></li>
              <li><a href="/login" className="text-decoration-none text-muted">Login</a></li>
              <li><a href="/register" className="text-decoration-none text-muted">Register</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Contact</h5>
            <p className="text-muted mb-1">
              📧 support@cinebook.com
            </p>
            <p className="text-muted mb-1">
              📞 +91 98765 43210
            </p>
            <p className="text-muted">
              📍 Madurai, Tamil Nadu
            </p>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center text-muted">
          © {new Date().getFullYear()} CineBook. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;