import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'https://recruter-backend.vercel.app/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  toast.error('Network request failed');
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname === '/login';
      
      if (!isLoginPage) {
        localStorage.removeItem('token');
        toast.error('Session expired. Please login again.', {
          autoClose: 4000,
          onClose: () => {
            window.location.href = '/login';
          }
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;