import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to automatically attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campustales_token');
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error parsing & automatic 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Clear invalid or stale token so app doesn't remain in a broken auth state
      localStorage.removeItem('campustales_token');
      window.dispatchEvent(
        new CustomEvent('campustales:unauthorized', {
          detail: error.response?.data?.message || 'Session expired. Please log in again.',
        })
      );
    }

    let message = 'Unable to connect to server. Please check your connection and try again.';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (typeof error.response?.data === 'string' && error.response.data.length < 200) {
      message = error.response.data;
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message = 'Request timed out. Please check your connection and try again.';
    } else if (error.response?.status === 400) {
      message = 'Please check your submitted details and try again.';
    } else if (error.response?.status === 401) {
      message = 'Invalid email or password.';
    } else if (error.response?.status === 404) {
      message = 'Requested service not found.';
    } else if (error.response?.status >= 500) {
      message = 'Server is currently busy. Please try again in a few moments.';
    } else if (error.message === 'Network Error' || !error.response) {
      message = 'Unable to connect to CampusTales server. Please check your connection.';
    } else if (error.message && !error.message.includes('status code')) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
