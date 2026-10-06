import { eventsData } from '../data/events';
import API_CONFIG, { delay, createApiResponse } from './api';

export const eventService = {
  /**
   * Fetch all department events
   * Future mapping: GET /api/events
   */
  async getAll() {
    await delay();
    return createApiResponse(eventsData, "Events retrieved");
  },

  async getUpcoming() {
    await delay();
    const upcoming = eventsData.filter((e) => e.status === "Upcoming");
    return createApiResponse(upcoming);
  }
};
