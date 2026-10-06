import { noticesData } from '../data/notices';
import API_CONFIG, { delay, createApiResponse, ApiError } from './api';

export const noticeService = {
  /**
   * Fetch all notices with optional search and category filter
   * Future mapping: GET /api/notices
   */
  async getAll({ category = "All", search = "", limit = null } = {}) {
    if (!API_CONFIG.USE_MOCK_API) {
      try {
        const params = new URLSearchParams();
        if (category && category !== "All") params.append("category", category);
        if (search) params.append("search", search);
        if (limit) params.append("limit", limit);
        const res = await fetch(`${API_CONFIG.BASE_URL}/notices?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) return json;
        }
      } catch (err) {
        console.warn("Backend API unavailable, using fallback notices:", err.message);
      }
    }

    await delay();
    let filtered = [...noticesData];

    if (category && category !== "All") {
      filtered = filtered.filter(
        (n) => n.category.toLowerCase() === category.toLowerCase() || n.tag.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          (n.referenceNo && n.referenceNo.toLowerCase().includes(q))
      );
    }

    if (limit && typeof limit === "number") {
      filtered = filtered.slice(0, limit);
    }

    return createApiResponse(filtered, "Notices fetched successfully");
  },

  /**
   * Fetch a single notice by ID
   * Future mapping: GET /api/notices/:id
   */
  async getById(id) {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await fetch(`${API_CONFIG.BASE_URL}/notices/${id}`);
      if (!res.ok) throw new ApiError("Notice not found", res.status);
      return res.json();
    }

    await delay();
    const notice = noticesData.find((n) => n.id === id || n._id === id);
    if (!notice) {
      throw new ApiError(`Notice with ID '${id}' was not found.`, 404);
    }

    return createApiResponse(notice, "Notice details fetched successfully");
  },

  /**
   * Fetch latest notices for Home Page ticker and Notice Board
   */
  async getLatest(limit = 4) {
    return this.getAll({ limit });
  }
};
