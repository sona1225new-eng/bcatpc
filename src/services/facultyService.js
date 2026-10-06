import { facultiesData } from '../data/faculties';
import API_CONFIG, { delay, createApiResponse, ApiError } from './api';

export const facultyService = {
  /**
   * Fetch all faculties
   * Mapping: GET /api/faculties
   */
  async getAll() {
    if (!API_CONFIG.USE_MOCK_API) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/faculties`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) return json;
        }
      } catch (err) {
        console.warn("Backend API unavailable, using fallback faculty data:", err.message);
      }
    }

    await delay();
    return createApiResponse(facultiesData, "Faculties retrieved successfully");
  },

  /**
   * Fetch a single faculty by ID
   * Mapping: GET /api/faculties/:id
   */
  async getById(id) {
    if (!API_CONFIG.USE_MOCK_API) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/faculties/${id}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Backend API unavailable, using fallback faculty data:", err.message);
      }
    }

    await delay();
    const faculty = facultiesData.find(
      (f) => f.id === id || f._id === id || f.id.toLowerCase() === id.toLowerCase()
    );

    if (!faculty) {
      throw new ApiError(`Faculty with identifier '${id}' was not found.`, 404);
    }

    return createApiResponse(faculty, "Faculty details retrieved");
  },

  /**
   * Quick summary list for navbar dropdown
   */
  async getNavSummary() {
    if (!API_CONFIG.USE_MOCK_API) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/faculties`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            const summary = json.data.map((f) => ({
              id: f._id || f.id,
              name: f.name,
              shortDesignation: f.shortDesignation || f.designation,
            }));
            return createApiResponse(summary);
          }
        }
      } catch {
        // fallback to static
      }
    }

    await delay(30);
    const summary = facultiesData.map((f) => ({
      id: f.id,
      name: f.name,
      shortDesignation: f.shortDesignation,
    }));
    return createApiResponse(summary);
  }
};
