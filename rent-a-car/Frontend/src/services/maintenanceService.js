import axiosClient from '../api/axiosClient';

export const list = (params) => axiosClient.get('/maintenance', { params });
export const getById = (id) => axiosClient.get(`/maintenance/${id}`);
export const create = (payload) => axiosClient.post('/maintenance', payload);
export const update = (id, payload) => axiosClient.put(`/maintenance/${id}`, payload);
export const resolve = (id) => axiosClient.patch(`/maintenance/${id}/resolve`);
export const remove = (id) => axiosClient.delete(`/maintenance/${id}`);
