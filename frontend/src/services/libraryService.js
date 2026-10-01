import api from './api';

const libraryService = {
  getLibraries: async (params = {}) => {
    const response = await api.get('/libraries', { params });
    return response.data || response;
  },

  getNearbyLibraries: async (lat, lng, radius = 50) => {
    const response = await api.get('/libraries/nearby', { params: { lat, lng, radius } });
    return response.data || response;
  },

  getLibraryById: async (id) => {
    const response = await api.get(`/libraries/${id}`);
    return response.data || response;
  },

  updateLibrarySeats: async (id, data) => {
    const response = await api.patch(`/libraries/${id}/seats`, data);
    return response.data || response;
  },

  createLibrary: async (data) => {
    const response = await api.post('/libraries', data);
    return response.data || response;
  },

  updateLibrary: async (id, data) => {
    const response = await api.put(`/libraries/${id}`, data);
    return response.data || response;
  },

  deleteLibrary: async (id) => {
    const response = await api.delete(`/libraries/${id}`);
    return response.data || response;
  }
};

export default libraryService;
