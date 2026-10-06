import api from './api';

export const pyqService = {
  async getAll(params = {}) {
    return api.get('/pyqs', { params: { all: true, ...params } });
  },

  async getById(id) {
    return api.get(`/pyqs/${id}`);
  },

  async create(data) {
    // If data is FormData (has file), let Axios set boundary
    if (data instanceof FormData) {
      return api.post('/pyqs', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/pyqs', data);
  },

  async update(id, data) {
    if (data instanceof FormData) {
      return api.put(`/pyqs/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/pyqs/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/pyqs/${id}`);
  },
};
