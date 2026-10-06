import api from './api';

export const noticeService = {
  async getAll(params = {}) {
    return api.get('/notices', { params: { all: true, ...params } });
  },

  async getById(id) {
    return api.get(`/notices/${id}`);
  },

  async create(data) {
    return api.post('/notices', data);
  },

  async update(id, data) {
    return api.put(`/notices/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/notices/${id}`);
  },
};
