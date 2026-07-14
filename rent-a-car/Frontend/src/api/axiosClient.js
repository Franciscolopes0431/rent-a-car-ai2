import axios from 'axios';

const STORAGE_KEY = 'authSession';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api'),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = String(error.config?.url || '');
    const isAuthBootstrap = requestUrl.includes('/auth/me');
    const isLoginRequest = requestUrl.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest && !isAuthBootstrap && window.location.pathname !== '/login') {
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
      window.location.assign('/login');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
