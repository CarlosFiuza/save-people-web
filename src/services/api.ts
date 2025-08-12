import axios from 'axios';
import { TOKEN_KEY } from '../types';

const baseURL = (import.meta as any).env.VITE_API_BASE_URL;

if (!baseURL) {
  console.error('Variável de ambiente VITE_API_BASE_URL não definida!');
}

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session_expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;