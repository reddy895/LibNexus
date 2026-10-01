import api from './api';

const bookService = {
  getBooks: async (params = {}) => {
    const response = await api.get('/books', { params });
    return response.data || response;
  },

  getNewArrivals: async () => {
    const response = await api.get('/books', { params: { isNewArrival: true } });
    return response.data || response;
  },

  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data || response;
  },

  createBook: async (data) => {
    const response = await api.post('/books', data);
    return response.data || response;
  },

  updateBook: async (id, data) => {
    const response = await api.put(`/books/${id}`, data);
    return response.data || response;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data || response;
  }
};

export default bookService;
