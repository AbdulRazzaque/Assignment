import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach bearer token if stored in local session
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('taskflow_auth_token');
      if (storedToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return structured error message if API returned ApiResponse format
    const customMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    
    return Promise.reject(new Error(customMessage));
  }
);
