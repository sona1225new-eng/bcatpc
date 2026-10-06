import api from './api';

export const authService = {
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('tp_admin_token', res.data.token);
      localStorage.setItem('tp_admin_user', JSON.stringify(res.data.admin));
    }
    return res;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('tp_admin_token');
      localStorage.removeItem('tp_admin_user');
    }
  },

  async getMe() {
    return api.get('/auth/me');
  },

  async changePassword(currentPassword, newPassword) {
    return api.put('/auth/change-password', { currentPassword, newPassword });
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('tp_admin_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('tp_admin_token');
  },
};
