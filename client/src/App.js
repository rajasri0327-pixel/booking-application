import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import TheatreManagement from './pages/TheatreManagement';
import SeatSelection from './pages/SeatSelection';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import './index.css'
import Footer from './components/Footer';

// Secure Routing Guard Component
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ minHeight: '85vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/theatres" element={<TheatreManagement />} />
          <Route path="/seats" element={<SeatSelection />} />

          {/* Authenticated user endpoints */}
          <Route path="/my-bookings" element={
            <ProtectedRoute><MyBookings /></ProtectedRoute>
          } />

          {/* Admin authorization required endpoints */}
          <Route path="/admin" element={
            <ProtectedRoute isAdmin={true}><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;