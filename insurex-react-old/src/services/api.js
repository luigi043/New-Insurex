import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = Bearer ;  // 'Bearer' is a string literal, not a variable
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  test: () => api.get('/auth/test'),
  health: () => api.get('/auth/health'),
  info: () => api.get('/auth/info'),
};

// Asset endpoints (to be implemented)
export const assets = {
  getAll: () => api.get('/assets'),
  getById: (id) => api.get(/assets/),
  create: (data) => api.post('/assets', data),
  update: (id, data) => api.put(/assets/, data),
  delete: (id) => api.delete(/assets/),
};

export default api;
