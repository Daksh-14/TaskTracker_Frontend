// axiosInstance.js
import axios from 'axios';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'https://tasktracker-backend-89m8.onrender.com/', // Adjust the base URL as necessary
  withCredentials: true, // Important to include cookies
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 404) {
      // Handle token expiration
      const originalRequest = error.config;
      if (error.response.data.message === 'Refresh token expired') {
        // Call logout from AuthContext
        const { logout } = useAuth();
        logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
