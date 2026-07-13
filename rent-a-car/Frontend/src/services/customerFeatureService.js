import axiosClient from '../api/axiosClient';

export const listTickets = () => axiosClient.get('/customer-features/support');
export const createTicket = (payload) => axiosClient.post('/customer-features/support', payload);
export const createPublicTicket = (payload) => axiosClient.post('/customer-features/support/public', payload);
export const updateTicket = (id, status) => axiosClient.patch(`/customer-features/support/${id}`, { status });
export const removeTicket = (id) => axiosClient.delete(`/customer-features/support/${id}`);
export const listTicketMessages = (id) => axiosClient.get(`/customer-features/support/${id}/messages`);
export const sendTicketMessage = (id, message) => axiosClient.post(`/customer-features/support/${id}/messages`, { message });
export const listReviews = () => axiosClient.get('/customer-features/reviews');
export const createReview = (payload) => axiosClient.post('/customer-features/reviews', payload);
export const listPublicReviews = (vehicleId) => axiosClient.get('/customer-features/reviews/public', { params: vehicleId ? { vehicleId } : {} });
export const listManagedReviews = (status) => axiosClient.get('/customer-features/reviews/manage', { params: status ? { status } : {} });
export const moderateReview = (id, payload) => axiosClient.patch(`/customer-features/reviews/${id}/moderate`, payload);
export const removeReview = (id) => axiosClient.delete(`/customer-features/reviews/${id}`);
