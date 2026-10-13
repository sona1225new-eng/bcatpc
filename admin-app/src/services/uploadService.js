import api from './api';

export const uploadService = {
  async uploadFile(file, type) {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      params: type ? { type } : undefined,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
