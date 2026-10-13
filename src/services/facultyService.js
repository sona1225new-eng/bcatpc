import { facultiesData } from '../data/faculties';
import API_CONFIG, { delay, createApiResponse, ApiError } from './api';

const requestFaculties = async (path = '') => {
  let response;
  try {
    response = await fetch(`${API_CONFIG.BASE_URL.replace(/\/+$/, '')}/faculties${path}`);
  } catch (error) {
    throw new ApiError(`Unable to load faculty records from the API: ${error.message}`, 0);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new ApiError('The faculty API returned an invalid response.', response.status);
  }

  if (!response.ok) {
    throw new ApiError(result.message || 'Failed to load faculty records.', response.status);
  }
  if (!result || !Object.prototype.hasOwnProperty.call(result, 'data')) {
    throw new ApiError('The faculty API response is missing its data.', response.status);
  }
  return result;
};

const normalizeFaculty = (faculty) => ({
  ...faculty,
  id: String(faculty._id || faculty.id || ''),
});

export const facultyService = {
  async getAll() {
    if (API_CONFIG.USE_MOCK_API) {
      await delay();
      return createApiResponse(facultiesData, 'Faculties retrieved successfully');
    }

    const result = await requestFaculties();
    if (!Array.isArray(result.data)) {
      throw new ApiError('The faculty API returned an invalid faculty list.', 502);
    }
    return { ...result, data: result.data.map(normalizeFaculty) };
  },

  async getById(id) {
    if (API_CONFIG.USE_MOCK_API) {
      await delay();
      const faculty = facultiesData.find(
        (item) => item.id === id || item._id === id || item.id.toLowerCase() === id.toLowerCase()
      );
      if (!faculty) {
        throw new ApiError(`Faculty with identifier '${id}' was not found.`, 404);
      }
      return createApiResponse(faculty, 'Faculty details retrieved');
    }

    const result = await requestFaculties(`/${encodeURIComponent(id)}`);
    if (!result.data || typeof result.data !== 'object' || Array.isArray(result.data)) {
      throw new ApiError('The faculty API returned an invalid faculty record.', 502);
    }
    return { ...result, data: normalizeFaculty(result.data) };
  },

  async getNavSummary() {
    if (API_CONFIG.USE_MOCK_API) {
      await delay(30);
      return createApiResponse(facultiesData.map((faculty) => ({
        id: faculty.id,
        name: faculty.name,
        shortDesignation: faculty.shortDesignation || faculty.designation,
      })));
    }

    const result = await facultyService.getAll();
    const summary = result.data.map((faculty) => ({
      id: faculty._id || faculty.id,
      name: faculty.name,
      shortDesignation: faculty.shortDesignation || faculty.designation,
    }));
    return createApiResponse(summary);
  },
};
