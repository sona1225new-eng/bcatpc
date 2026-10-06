import { galleryData, galleryCategories } from '../data/gallery';
import API_CONFIG, { delay, createApiResponse, ApiError } from './api';

export const galleryService = {
  /**
   * Fetch all gallery images with optional category filter
   * Future mapping: GET /api/gallery
   */
  async getAll({ category = "All" } = {}) {
    if (!API_CONFIG.USE_MOCK_API) {
      try {
        const params = new URLSearchParams();
        if (category && category !== "All") params.append("category", category);
        const res = await fetch(`${API_CONFIG.BASE_URL}/gallery?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) return json;
        }
      } catch (err) {
        console.warn("Backend API unavailable, using fallback gallery:", err.message);
      }
    }

    await delay();
    let filtered = [...galleryData];
    if (category && category !== "All") {
      filtered = filtered.filter(
        (img) => img.category.toLowerCase() === category.toLowerCase()
      );
    }

    return createApiResponse(filtered, "Gallery images fetched");
  },

  async getCategories() {
    await delay(10);
    return createApiResponse(galleryCategories);
  }
};
