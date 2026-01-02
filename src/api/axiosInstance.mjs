import axios from 'axios';

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - adds CSRF token to all non-GET requests
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[HR Portal API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[HR Portal API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[HR Portal API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    // Log error details for debugging
    console.error(`[HR Portal API] Response error for ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response?.status, error.response?.data || error.message);

    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
