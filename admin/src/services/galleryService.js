import api from './api';

export const galleryService = {
  async getAll(params = {}) {
    return api.get('/galleries', { params: { all: true, ...params } });
  },

  async getById(id) {
    return api.get(`/galleries/${id}`);
  },

  async create(data) {
    return api.post('/galleries', data);
  },

  async update(id, data) {
    return api.put(`/galleries/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/galleries/${id}`);
  },
};
