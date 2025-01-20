//services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';
import { createBrowserHistory } from 'history';
// import { useContext } from 'react'
// import { AppContext } from '../context/AppContext'

const backendUrl = import.meta.env.VITE_BACKEND_URL; 

// Create Axios instance
const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true, // Include cookies
});

// Custom browser history for redirection
export const history = createBrowserHistory();

// Request interceptor to include Authorization header (if needed)
api.interceptors.request.use(
  (config) => {
    // Tokens are automatically handled by cookies; nothing to add here.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refreshing
api.interceptors.response.use(
  (response) => response,
  async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
              await api.post('/api/auth/refresh-token');
              return api(originalRequest); // Retry original request
          } catch (refreshError) {
              console.error('Refresh token failed:', refreshError);
              toast.error('Session expired. Please log in again.');
              localStorage.removeItem('isLoggedIn'); // Clear local storage
              history.push('/login'); // Redirect to login
          }
      }

      return Promise.reject(error);
  }
);

export default api;
