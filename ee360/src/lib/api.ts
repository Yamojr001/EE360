import axios from 'axios';

const BASE_URL = 'https://api.eefarm360.com/api'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: false,
});

// Attach stored JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ee360_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ee360_token');
      localStorage.removeItem('ee360_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;
