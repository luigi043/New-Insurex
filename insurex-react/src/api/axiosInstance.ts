import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: Attach Auth Token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Global Error Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    
    if (status === 401) {
      // Auto-logout or token refresh logic (Phase 1.2)
      window.location.href = '/login';
    }
    
    // Global Toast Notification logic can be triggered here
    return Promise.reject(error);
  }
);

export default axiosInstance;