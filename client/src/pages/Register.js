import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/apiFixed';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
    try {
      const { data } = await register({ name: formData.name, email: formData.email, mobile: formData.mobile, password: formData.password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center my-5" style={{ minHeight: '80vh' }}>
      <div className="card bg-custom-dark text-white p-4 shadow rounded" style={{ width: '100%', maxWidth: '450px' }}>
        <h3 className="text-center text-primary-color mb-4 fw-bold">Create Account</h3>
        {error && <div className="alert alert-danger small py-2">{error}</div>}
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label className="form-label small text-muted">Full Name</label>
            <input type="text" className="form-control bg-dark text-white border-secondary" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label small text-muted">Email Address</label>
            <input type="email" className="form-control bg-dark text-white border-secondary" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label small text-muted">Mobile Number</label>
            <input type="text" className="form-control bg-dark text-white border-secondary" required onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label small text-muted">Password</label>
            <input type="password" className="form-control bg-dark text-white border-secondary" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="form-label small text-muted">Confirm Password</label>
            <input type="password" className="form-control bg-dark text-white border-secondary" required onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary-color w-100 py-2 fw-semibold">Register</button>
        </form>
        <p className="mt-3 small text-center text-muted">Already registered? <Link to="/login" className="text-primary-color">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Register;