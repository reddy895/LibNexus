import api from './api';

const seatService = {
  getSeatsByLibrary: async (libraryId) => {
    const response = await api.get(`/seats/library/${libraryId}`);
    return response.data;
  },

  getLibraryAvailability: async (libraryId, params = {}) => {
    const response = await api.get(`/seats/library/${libraryId}/availability`, { params });
    return response.data;
  }
};

export default seatService;
