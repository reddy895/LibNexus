import api from './api';

const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get('/admin/bookings');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUserRole: async (userId, data) => {
    const response = await api.put(`/admin/users/${userId}/role`, data);
    return response.data;
  },

  createLibrary: async (data) => {
    const response = await api.post('/admin/libraries', data);
    return response.data;
  },

  updateLibrary: async (id, data) => {
    const response = await api.put(`/admin/libraries/${id}`, data);
    return response.data;
  },

  deleteLibrary: async (id) => {
    const response = await api.delete(`/admin/libraries/${id}`);
    return response.data;
  },

  createBook: async (data) => {
    const response = await api.post('/admin/books', data);
    return response.data;
  },

  updateBook: async (id, data) => {
    const response = await api.put(`/admin/books/${id}`, data);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/admin/books/${id}`);
    return response.data;
  },

  updateSeatStatus: async (seatId, data) => {
    const response = await api.put(`/admin/seats/${seatId}/status`, data);
    return response.data;
  }
};

export default adminService;
