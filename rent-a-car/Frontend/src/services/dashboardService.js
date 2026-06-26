import axiosClient from '../api/axiosClient';

export const getStats = () => axiosClient.get('/dashboard/stats');

export const getAlerts = () => axiosClient.get('/dashboard/alerts');
