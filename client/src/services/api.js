import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
    const profile = localStorage.getItem('userInfo');
    if (profile) {
        try {
            const { token } = JSON.parse(profile);
            if (token) {
                req.headers.Authorization = `Bearer ${token}`;
                console.log('✓ Token attached to request:', token.substring(0, 20) + '...');
            } else {
                console.warn('⚠ No token found in userInfo');
            }
        } catch (error) {
            console.error('Error parsing userInfo:', error);
        }
    } else {
        console.warn('⚠ userInfo not found in localStorage');
    }
    return req;
});

// Add response interceptor to catch auth errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('❌ Authentication failed:', error.response?.data?.message);
            localStorage.removeItem('userInfo');
        }
        return Promise.reject(error);
    }
);

export const login = (formData) => API.post('/users/login', formData);
export const register = (formData) => API.post('/users/register', formData);
export const fetchUsers = () => API.get('/users');

export const getMovies = () => API.get('/movies');
export const addMovie = (data) => API.post('/movies', data);
export const updateMovie = (id, data) => API.put(`/movies/${id}`, data);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);

export const getTheatres = () => API.get('/theatres');
export const addTheatre = (data) => API.post('/theatres', data);

// FIX: Changed from `/bookings/user/${userId}` to `/bookings/mine`
export const createBooking = (data) => API.post('/bookings', data);
export const getUserBookings = () => API.get('/bookings/mine'); 
export const getAllBookings = () => API.get('/bookings');
export const cancelBooking = (id) => API.delete(`/bookings/${id}`);

export const getBookedSeats = (params) => API.get('/bookings/booked-seats', { params });

// NOTE: A safety interceptor to ensure the Authorization header is correctly set
// This overrides any broken earlier interceptor and guarantees Bearer token format.
API.interceptors.request.use((req) => {
    try {
        const profile = localStorage.getItem('userInfo');
        if (profile) {
            const parsed = JSON.parse(profile);
            const token = parsed?.token || parsed?.authToken || null;
            if (token) {
                req.headers = req.headers || {};
                req.headers.Authorization = `Bearer ${token}`;
                // Minimal log to avoid exposing full token
                console.log('✅ [API] Authorization header set (truncated):', String(token).substring(0, 20) + '...');
            }
        }
    } catch (e) {
        console.error('[API] Failed to attach Authorization header:', e);
    }
    return req;
});