import axiosClient from '../api/axiosClient';
export const listStaff = () => axiosClient.get('/admin/staff');
export const createStaff = (payload) => axiosClient.post('/admin/staff', payload);
export const updateStaff = (id, payload) => axiosClient.put(`/admin/staff/${id}`, payload);
export const updateStaffPassword = (id, password) => axiosClient.patch(`/admin/staff/${id}/password`, { password });
export const deleteStaff = (id) => axiosClient.delete(`/admin/staff/${id}`);
export const listAudit = (params) => axiosClient.get('/admin/audit', { params });
export const getSettings = () => axiosClient.get('/admin/settings');
export const updateSettings = (payload) => axiosClient.put('/admin/settings', payload);
