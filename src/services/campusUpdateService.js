import { campusUpdatesData } from '../data/campusUpdates';
import API_CONFIG, { delay, createApiResponse, ApiError } from './api';

export const campusUpdateService = {
  /**
   * Fetch all campus updates
   * Future mapping: GET /api/campus-updates
   */
  async getAll({ category = "All", search = "", limit = null } = {}) {
    if (!API_CONFIG.USE_MOCK_API) {
      try {
        const params = new URLSearchParams();
        if (category && category !== "All") params.append("category", category);
        if (search) params.append("search", search);
        if (limit) params.append("limit", limit);
        const res = await fetch(`${API_CONFIG.BASE_URL}/campus-updates?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) return json;
        }
      } catch (err) {
        console.warn("Backend API unavailable, using fallback campus updates:", err.message);
      }
    }

    await delay();
    let filtered = [...campusUpdatesData];

    if (category && category !== "All") {
      filtered = filtered.filter(
        (u) => u.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.title.toLowerCase().includes(q) ||
          u.shortDescription.toLowerCase().includes(q) ||
          u.content.toLowerCase().includes(q) ||
          (u.tags && u.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (limit && typeof limit === "number") {
      filtered = filtered.slice(0, limit);
    }

    return createApiResponse(filtered, "Campus updates fetched successfully");
  },

  /**
   * Fetch a single campus update by ID
   * Future mapping: GET /api/campus-updates/:id
   */
  async getById(id) {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await fetch(`${API_CONFIG.BASE_URL}/campus-updates/${id}`);
      if (!res.ok) throw new ApiError("Campus update not found", res.status);
      return res.json();
    }

    await delay();
    const update = campusUpdatesData.find((u) => u.id === id || u._id === id);
    if (!update) {
      throw new ApiError(`Campus update with ID '${id}' was not found.`, 404);
    }

    return createApiResponse(update, "Campus update retrieved");
  },

  async getLatest(limit = 3) {
    return this.getAll({ limit });
  }
};
