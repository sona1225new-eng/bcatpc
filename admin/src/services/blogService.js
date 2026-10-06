import api from './api';

export const blogService = {
  async getAll(params = {}) {
    return api.get('/blogs', { params: { all: true, ...params } });
  },

  async getById(id) {
    return api.get(`/blogs/${id}`);
  },

  async create(data) {
    return api.post('/blogs', data);
  },

  async update(id, data) {
    return api.put(`/blogs/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/blogs/${id}`);
  },
};
