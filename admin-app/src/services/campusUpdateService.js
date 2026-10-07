import api from './api';

export const campusUpdateService = {
  async getAll(params = {}) {
    return api.get('/campus-updates', { params: { all: true, ...params } });
  },

  async getById(id) {
    return api.get(`/campus-updates/${id}`);
  },

  async create(data) {
    return api.post('/campus-updates', data);
  },

  async update(id, data) {
    return api.put(`/campus-updates/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/campus-updates/${id}`);
  },
};
