import axiosClient from '../api/axiosClient';

export const list = (params) => axiosClient.get('/bookings', { params });
export const getById = (id) => axiosClient.get(`/bookings/${id}`);
export const create = (payload) => axiosClient.post('/bookings', payload);
export const update = (id, payload) => axiosClient.put(`/bookings/${id}`, payload);
export const changeStatus = (id, status) => axiosClient.patch(`/bookings/${id}/status`, { status });
export const cancel = (id) => axiosClient.delete(`/bookings/${id}`);
