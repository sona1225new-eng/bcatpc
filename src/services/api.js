/**
 * Central API Client configuration
 * In the future, this file will point to the Node.js/Express REST API.
 * Currently, it serves data with realistic async latency and standard API response contracts.
 */

const API_CONFIG = {
  // Mock API disabled by default; set VITE_USE_MOCK_API=true in .env to enable mock mode
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === "true",
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  SIMULATED_DELAY_MS: 80, // Snappy realistic response
};

export class ApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Standard simulated API delay helper
 */
export const delay = (ms = API_CONFIG.SIMULATED_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Universal Response Wrapper
 */
export const createApiResponse = (data, message = "Success", status = 200) => ({
  success: status >= 200 && status < 300,
  status,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export default API_CONFIG;
