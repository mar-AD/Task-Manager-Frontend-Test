import api from './axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);

    const token = response.data?.user?.token;
    if (!token) throw new Error('Server did not return authentication token');

    if (typeof token !== 'string' || !token.startsWith('eyJ')) {
      throw new Error('Invalid token format received');
    }

    localStorage.setItem('token', token);

    const decoded = jwtDecode(token);
    if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem('token');
      throw new Error('Token expired immediately');
    }

    return {
      user: {
        ...response.data.user,
        token: undefined
      },
      token,
      expiresAt: decoded.exp * 1000
    };

  } catch (error) {
    localStorage.removeItem('token');
    throw error;
  }
};

export const validateToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};