import api from './api';

export const albumService = {
  getAllAdmin: (params = {}) => api.get('/albums/admin/all', { params }),
  getByIdAdmin: (id) => api.get(`/albums/admin/${id}`),
  create: (data) => api.post('/albums', data),
  update: (id, data) => api.put(`/albums/${id}`, data),
  togglePublish: (id) => api.patch(`/albums/${id}/publish`),
  delete: (id) => api.delete(`/albums/${id}`),
  getPublicAlbums: (params = {}) => api.get('/albums', { params }),
  getPublicAlbumBySlug: (slug) => api.get(`/albums/${slug}`),

  async uploadMultipleImages(files) {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
