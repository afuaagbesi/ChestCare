
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

//Axios instance for API calls
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('access') || null
  );
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem('refresh') || null
  );

  // Attach access token to axios headers
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  // Setup interceptor to refresh token on 401
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          refreshToken
        ) {
          originalRequest._retry = true;
          try {
            const res = await api.post('/api/auth/token/refresh/', {
              refresh: refreshToken,
            });
            setAccessToken(res.data.access);
            localStorage.setItem('access', res.data.access);
            originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
            return api(originalRequest);
          } catch (refreshError) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [refreshToken]);

  const isAuthenticated = !!accessToken;

  const login = async (email, password) => {
    const payload = { email, password };
    const res = await api.post('/api/auth/login/', payload);
    // Destructure data
    const { access, refresh, user: userData } = res.data;
    // Save to state and localStorage
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const register = async (registrationData) => {
    const payload = {
      email: registrationData.email,
      password: registrationData.password,
      confirm_password: registrationData.confirmPassword,
      first_name: registrationData.firstName,
      last_name: registrationData.lastName,
      phone_number: registrationData.phoneNumber,
      country: registrationData.country,
    };
    
    const res = await api.post('/api/auth/register/', payload);
    
    // Destructure data - registration returns tokens and user data
    const { access, refresh, user: userData } = res.data;
    
    // Save to state and localStorage (auto-login after registration)
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        login,
        register,
        logout,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);