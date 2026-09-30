import api from './api';

const bookService = {
  getBooks: async (params = {}) => {
    const response = await api.get('/books', { params });
    return response.data;
  },

  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  }
};

export default bookService;
