import api from './api';

const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data || response;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data || response;
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data || response;
  },

  updateSeats: async (libraryId, occupiedSeats, totalSeats) => {
    const response = await api.patch(`/admin/libraries/${libraryId}/seats`, { occupiedSeats, totalSeats });
    return response.data || response;
  },

  getActivityLogs: async () => {
    const response = await api.get('/admin/activity');
    return response.data || response;
  }
};

export default adminService;
