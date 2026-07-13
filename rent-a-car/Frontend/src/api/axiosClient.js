import axios from 'axios';

const STORAGE_KEY = 'authSession';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = String(error.config?.url || '').includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest && window.location.pathname !== '/login') {
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
      window.location.assign('/login');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
