import api from './api';

export const facultyService = {
  async getAll(params = {}) {
    return api.get('/faculties', { params: { all: true, ...params } });
  },

  async getById(id) {
    return api.get(`/faculties/${id}`);
  },

  async create(data) {
    return api.post('/faculties', data);
  },

  async update(id, data) {
    return api.put(`/faculties/${id}`, data);
  },

  async delete(id, permanent = true) {
    return api.delete(`/faculties/${id}`, { params: { permanent } });
  },
};
