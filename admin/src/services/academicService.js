import api from './api';

export const academicService = {
  async getAll(params = {}) {
    return api.get('/academics', { params: { all: true, ...params } });
  },

  async getById(id) {
    return api.get(`/academics/${id}`);
  },

  async create(data) {
    return api.post('/academics', data);
  },

  async update(id, data) {
    return api.put(`/academics/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/academics/${id}`);
  },
};
