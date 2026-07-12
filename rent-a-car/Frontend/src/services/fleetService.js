import axiosClient from '../api/axiosClient';

export const getStatus = () => axiosClient.get('/vehicles');
