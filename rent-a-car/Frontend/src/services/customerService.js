import axiosClient from '../api/axiosClient';

export const list = (params) => axiosClient.get('/customers', { params });
export const getById = (id) => axiosClient.get(`/customers/${id}`);
export const create = (payload) => axiosClient.post('/customers', payload);
export const update = (id, payload) => axiosClient.put(`/customers/${id}`, payload);
export const remove = (id) => axiosClient.delete(`/customers/${id}`);
