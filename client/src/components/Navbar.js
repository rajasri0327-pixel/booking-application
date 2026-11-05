import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-custom-dark sticky-top border-bottom border-secondary shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 text-primary-color" to="/">CINEBOOK</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item"><Link className="nav-link text-white px-3" to="/">Home</Link></li>
            {user && (
              <li className="nav-item"><Link className="nav-link text-white px-3" to="/my-bookings">My Bookings</Link></li>
            )}

            {/* Admin access link: shows dashboard link to admins, admin-login to others */}
            {user && user.role === 'admin' ? (
              <li className="nav-item"><Link className="nav-link btn btn-outline-danger btn-sm text-white px-2 mx-2" to="/admin">Admin Dashboard</Link></li>
            ) : (
              <li className="nav-item"><Link className="nav-link text-white px-3" to="/admin-login">Admin Login</Link></li>
            )}
            {user ? (
              <li className="nav-item ms-2">
                <span className="text-muted me-3">Hi, {user.name}</span>
                <button className="btn btn-primary-color btn-sm px-3" onClick={logoutHandler}>Logout</button>
              </li>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link text-white px-3" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="btn btn-primary-color btn-sm px-3 ms-2" to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;