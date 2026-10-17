import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : 'https://tpcollege-backend.onrender.com/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPublicFileUrl = (fileUrl) => {
  if (!fileUrl) return '';
  try {
    const apiRoot = new URL(API_BASE_URL, window.location.origin);
    apiRoot.pathname = `${apiRoot.pathname.replace(/\/api\/?$/, '')}/`;
    const resolvedUrl = new URL(fileUrl, apiRoot);
    if (
      ['localhost', '127.0.0.1', '[::1]'].includes(resolvedUrl.hostname) &&
      resolvedUrl.pathname.startsWith('/uploads/')
    ) {
      return new URL(resolvedUrl.pathname, apiRoot).toString();
    }
    return resolvedUrl.toString();
  } catch {
    return fileUrl;
  }
};

export const isPublicFileUrl = (fileUrl) => {
  if (typeof fileUrl !== 'string' || !fileUrl.trim()) return false;
  if (fileUrl.startsWith('/uploads/')) return true;
  try {
    return ['http:', 'https:'].includes(new URL(fileUrl).protocol);
  } catch {
    return false;
  }
};

export const isPublicImageUrl = (fileUrl) => {
  if (typeof fileUrl !== 'string' || !fileUrl.trim()) return false;
  try {
    const url = new URL(fileUrl);
    return url.protocol === 'https:' &&
      !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) &&
      !url.username &&
      !url.password;
  } catch {
    return false;
  }
};

export const isPublicResumeUrl = (fileUrl) => {
  if (typeof fileUrl !== 'string' || !fileUrl.trim()) return false;
  try {
    const url = new URL(fileUrl);
    return url.protocol === 'https:' &&
      !['localhost', '127.0.0.1', '::1'].includes(url.hostname) &&
      url.pathname.toLowerCase().endsWith('.pdf');
  } catch {
    return false;
  }
};

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tp_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if already on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('tp_admin_token');
        localStorage.removeItem('tp_admin_user');
        window.location.href = '/login?expired=true';
      }
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export default api;
