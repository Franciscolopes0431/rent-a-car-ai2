import axiosClient from '../api/axiosClient';

export const list = (params) => axiosClient.get('/vehicles', { params });
export const getById = (id) => axiosClient.get(`/vehicles/${id}`);
export const create = (payload) => axiosClient.post('/vehicles', payload);
export const update = (id, payload) => axiosClient.put(`/vehicles/${id}`, payload);
export const remove = (id) => axiosClient.delete(`/vehicles/${id}`);
export const changeStatus = (id, status) => axiosClient.patch(`/vehicles/${id}/status`, { status });
