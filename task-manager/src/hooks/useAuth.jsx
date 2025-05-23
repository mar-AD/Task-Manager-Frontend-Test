import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSettingToken, setIsSettingToken] = useState(false);
  const navigate = useNavigate();

  const initializeAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Initial auth check - Token exists:', !!token);

      if (!token) {
        setLoading(false);
        return;
      }

      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        throw new Error('Token expired');
      }

      const decoded = jwtDecode(token);
      setUser({
        id: decoded.userId,
        username: decoded.username,
        role: decoded.role
      });

      console.log('ser:', decoded.username);
    } catch (error) {
      console.error( error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    setIsSettingToken(true);
    try {
      console.log('login...');
      const response = await api.post('/login', credentials);
      const token = response.data?.user?.token;

      if (!token) {
        throw new Error('No token received');
      }

      localStorage.setItem('token', token);
      console.log('ttoken stored ');

      await new Promise(resolve => setTimeout(resolve, 50));

      const decoded = jwtDecode(token);
      const userData = {
        id: decoded.userId,
        username: decoded.username,
        role: decoded.role
      };

      setUser(userData);
      navigate('/tasks');
      toast.success('Login successful');
      console.log('user loged in', userData.username);
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsSettingToken(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    toast.info('Logged out successfully');
  }, [navigate]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { exp } = jwtDecode(token);
          if (Date.now() >= exp * 1000) {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [logout]);

  useEffect(() => {
    initializeAuth();

    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        initializeAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initializeAuth]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        loading,
        isSettingToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};