import axiosClient from '../api/axiosClient';

export const register = (payload) => axiosClient.post('/auth/register', payload);

const authService = {
  login: async ({ email, password, rememberMe }) => {
    const response = await axiosClient.post('/auth/login', {
      email,
      password,
      rememberMe,
    });

    return response.data;
  },

  register: async (payload) => {
    const response = await register(payload);
    return response.data;
  },

  updateProfile: async (payload) => (await axiosClient.put('/auth/me', payload)).data,
  updatePassword: async (payload) => (await axiosClient.put('/auth/password', payload)).data,
  getProfile: async () => (await axiosClient.get('/auth/me')).data,
  logout: async () => axiosClient.post('/auth/logout'),

};

export default authService;
