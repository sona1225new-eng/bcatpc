import { academicsData } from '../data/academics';
import API_CONFIG, { delay, createApiResponse } from './api';

export const academicService = {
  /**
   * Fetch complete academic bundle
   * Future mapping: GET /api/academics
   */
  async getAll() {
    if (!API_CONFIG.USE_MOCK_API) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/academics`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) return json;
        }
      } catch (err) {
        console.warn("Backend API unavailable, using fallback academics:", err.message);
      }
    }
    await delay();
    return createApiResponse(academicsData, "Academics data retrieved");
  },

  async getOverview() {
    await delay();
    return createApiResponse(academicsData.programOverview);
  },

  async getSemestersStructure() {
    await delay();
    return createApiResponse(academicsData.semestersStructure);
  },

  async getLabs() {
    await delay();
    return createApiResponse(academicsData.labsDetails);
  },

  async getCalendar() {
    await delay();
    return createApiResponse(academicsData.academicCalendar);
  },

  async getInfrastructure() {
    await delay();
    return createApiResponse(academicsData.infrastructure);
  }
};
