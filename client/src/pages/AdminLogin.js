import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/apiFixed';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(formData);
      if (data.role !== 'admin') {
        setError('Not authorized as admin. Use admin credentials.');
        return;
      }
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card bg-custom-dark text-white p-4 shadow rounded" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center text-primary-color mb-4 fw-bold">Admin Sign In</h3>
        {error && <div className="alert alert-danger small py-2">{error}</div>}
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label className="form-label small text-muted">Email Address</label>
            <input type="email" className="form-control bg-dark text-white border-secondary" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="form-label small text-muted">Password</label>
            <input type="password" className="form-control bg-dark text-white border-secondary" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary-color w-100 py-2 fw-semibold">Login as Admin</button>
        </form>
        <p className="mt-3 small text-center text-muted">Back to <Link to="/login" className="text-primary-color">User Login</Link></p>
      </div>
    </div>
  );
};

export default AdminLogin;
