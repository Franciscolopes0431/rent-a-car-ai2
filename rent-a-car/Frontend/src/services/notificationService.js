import axiosClient from '../api/axiosClient';
export const list = () => axiosClient.get('/notifications');
export const markRead = (id) => axiosClient.patch(`/notifications/${id}/read`);
export const markAllRead = () => axiosClient.patch('/notifications/read-all');
