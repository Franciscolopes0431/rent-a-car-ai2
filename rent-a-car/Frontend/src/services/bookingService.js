import axiosClient from '../api/axiosClient';

export const list = (params) => axiosClient.get('/reservations', { params });
export const listCustomers = () => axiosClient.get('/reservations/customers/options');
export const createCustomer = (payload) => axiosClient.post('/reservations/customers', payload);
export const getById = (id) => axiosClient.get(`/reservations/${id}`);
export const create = (payload) => axiosClient.post('/reservations', payload);
export const update = (id, payload) => axiosClient.put(`/reservations/${id}`, payload);
export const changeStatus = (id, status) => axiosClient.patch(`/reservations/${id}/status`, { estado: status });
export const cancel = (id) => axiosClient.patch(`/reservations/${id}/cancel`);
