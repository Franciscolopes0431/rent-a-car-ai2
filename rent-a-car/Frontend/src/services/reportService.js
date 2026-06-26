import axiosClient from '../api/axiosClient';

export const revenue = (params) => axiosClient.get('/reports/revenue', { params });
export const bookingsByStatus = (params) => axiosClient.get('/reports/bookings-by-status', { params });
export const topVehicles = (params) => axiosClient.get('/reports/top-vehicles', { params });
export const topCustomers = (params) => axiosClient.get('/reports/top-customers', { params });
export const fleetUtilization = (params) => axiosClient.get('/reports/fleet-utilization', { params });
