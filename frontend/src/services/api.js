import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('libnexus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global API errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'API request failed';
    return Promise.reject(new Error(message));
  }
);

// Authentication Service
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

// Library Service
export const libraryService = {
  getLibraries: (params) => api.get('/libraries', { params }),
  getNearbyLibraries: (lat, lng, radius = 50) => api.get('/libraries/nearby', { params: { lat, lng, radius } }),
  getLibrary: (id) => api.get(`/libraries/${id}`),
  createLibrary: (data) => api.post('/libraries', data),
  updateLibrary: (id, data) => api.put(`/libraries/${id}`, data),
  deleteLibrary: (id) => api.delete(`/libraries/${id}`)
};

// Book Service
export const bookService = {
  getBooks: (params) => api.get('/books', { params }),
  getBook: (id) => api.get(`/books/${id}`),
  createBook: (data) => api.post('/books', data),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`)
};

// Seat Service
export const seatService = {
  getSeats: (libraryId, params) => api.get(`/libraries/${libraryId}/seats`, { params }),
  getAvailableSeats: (libraryId) => api.get(`/libraries/${libraryId}/seats/available`),
  createSeat: (data) => api.post('/seats', data),
  updateSeat: (id, data) => api.put(`/seats/${id}`, data),
  deleteSeat: (id) => api.delete(`/seats/${id}`)
};

// Booking Service
export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getBookings: (params) => api.get('/bookings', { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`)
};

// Admin Service
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role })
};

export default api;
