import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response;
  }
};

export default authService;
export { authService };
