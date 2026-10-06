import api from './api';

export const dashboardService = {
  async getStats() {
    return api.get('/dashboard/stats');
  },
};
