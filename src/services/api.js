/**
 * Central API Client configuration
 * In the future, this file will point to the Node.js/Express REST API.
 * Currently, it serves data with realistic async latency and standard API response contracts.
 */

const API_CONFIG = {
  // Mock API disabled by default; set VITE_USE_MOCK_API=true in .env to enable mock mode
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === "true",
  BASE_URL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? "http://localhost:5000/api"
      : "https://tpcollege-backend.onrender.com/api"),
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

export const getPublicFileUrl = (fileUrl) => {
  if (!fileUrl) return "";
  try {
    const apiRoot = new URL(API_CONFIG.BASE_URL);
    apiRoot.pathname = `${apiRoot.pathname.replace(/\/api\/?$/, "")}/`;
    const resolvedUrl = new URL(fileUrl, apiRoot);
    if (
      ['localhost', '127.0.0.1', '[::1]'].includes(resolvedUrl.hostname) &&
      resolvedUrl.pathname.startsWith("/uploads/")
    ) {
      return new URL(resolvedUrl.pathname, apiRoot).toString();
    }
    return resolvedUrl.toString();
  } catch {
    return fileUrl;
  }
};

export const isPublicFileUrl = (fileUrl) => {
  if (typeof fileUrl !== "string" || !fileUrl.trim()) return false;
  if (fileUrl.startsWith("/uploads/")) return true;
  try {
    return ["http:", "https:"].includes(new URL(fileUrl).protocol);
  } catch {
    return false;
  }
};

export const isPublicResumeUrl = (fileUrl) => {
  if (typeof fileUrl !== "string" || !fileUrl.trim()) return false;
  try {
    const url = new URL(fileUrl);
    return url.protocol === "https:" &&
      !["localhost", "127.0.0.1", "::1"].includes(url.hostname) &&
      url.pathname.toLowerCase().endsWith(".pdf");
  } catch {
    return false;
  }
};

export const isPublicPYQPdfUrl = (fileUrl) => {
  if (typeof fileUrl !== "string" || !fileUrl.trim()) return false;
  try {
    const url = new URL(fileUrl);
    return (
      url.protocol === "https:" &&
      !["localhost", "127.0.0.1", "::1"].includes(url.hostname) &&
      url.pathname.toLowerCase().endsWith(".pdf")
    );
  } catch {
    return false;
  }
};

export const isEphemeralUploadUrl = (fileUrl) => {
  if (typeof fileUrl !== "string" || !fileUrl.trim()) return false;
  if (fileUrl.startsWith("/uploads/")) return true;
  try {
    const url = new URL(fileUrl);
    return url.pathname.startsWith("/uploads/");
  } catch {
    return false;
  }
};

export default API_CONFIG;
