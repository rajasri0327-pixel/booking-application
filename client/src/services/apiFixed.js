import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Request interceptor: attach Authorization header when token available
API.interceptors.request.use(
  (req) => {
    try {
      const profile = localStorage.getItem('userInfo');
      if (profile) {
        const parsed = JSON.parse(profile);
        const token = parsed?.token || parsed?.authToken || null;
        if (token) {
          req.headers = req.headers || {};
          req.headers.Authorization = `Bearer ${token}`;
          console.log('✓ [API] Authorization header set (truncated):', String(token).substring(0, 20) + '...');
        }
      }
    } catch (error) {
      console.error('[API] Error attaching token to request:', error);
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle auth errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Authentication failed:', error.response?.data?.message);
      localStorage.removeItem('userInfo');
      // Optionally redirect to login: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (formData) => API.post('/users/login', formData);
export const register = (formData) => API.post('/users/register', formData);
export const fetchUsers = () => API.get('/users');

// Movies
export const getMovies = () => API.get('/movies');
export const addMovie = (data) => API.post('/movies', data);
export const updateMovie = (id, data) => API.put(`/movies/${id}`, data);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);

// Theatres
export const getTheatres = () => API.get('/theatres');
export const addTheatre = (data) => API.post('/theatres', data);

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getUserBookings = () => API.get('/bookings/mine');
export const getAllBookings = () => API.get('/bookings');
export const cancelBooking = (id) => API.delete(`/bookings/${id}`);
export const getBookedSeats = (params) => API.get('/bookings/booked-seats', { params });

export default API;
