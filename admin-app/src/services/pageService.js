import api from './api';

export const pageService = {
  getAllAdmin: (params = {}) => api.get('/pages/admin/all', { params }),
  getByIdAdmin: (id) => api.get(`/pages/admin/${id}`),
  create: (data) => api.post('/pages', data),
  update: (id, data) => api.put(`/pages/${id}`, data),
  togglePublish: (id) => api.patch(`/pages/${id}/publish`),
  delete: (id) => api.delete(`/pages/${id}`),
  getPublicPages: () => api.get('/pages'),
  getPublicPageBySlug: (slug) => api.get(`/pages/${slug}`),
};
