import api from './api';

const libraryService = {
  getLibraries: async (params = {}) => {
    const response = await api.get('/libraries', { params });
    return response.data;
  },

  getLibraryById: async (id) => {
    const response = await api.get(`/libraries/${id}`);
    return response.data;
  }
};

export default libraryService;
