import API_CONFIG, { createApiResponse, ApiError } from './api';

export const pageService = {
  /**
   * Fetch a single published page by slug from the backend API
   */
  async getBySlug(slug) {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/pages/${encodeURIComponent(slug)}`);
      const json = await res.json();
      if (!res.ok) {
        throw new ApiError(json.message || 'Page not found.', res.status);
      }
      return json;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(err.message || 'Failed to connect to backend server.', 500);
    }
  },

  /**
   * Fetch all published pages
   */
  async getAll() {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/pages`);
      const json = await res.json();
      if (!res.ok) {
        throw new ApiError(json.message || 'Failed to retrieve pages.', res.status);
      }
      return json;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      return createApiResponse([], 'No dynamic pages available.');
    }
  },
};
