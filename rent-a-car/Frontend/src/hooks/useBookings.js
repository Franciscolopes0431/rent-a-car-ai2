import { useCallback, useEffect, useMemo, useState } from 'react';
import * as bookingService from '../services/bookingService';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ status: '', search: '', from: '', to: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async (overrides = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const params = { ...filters, page: pagination.page, pageSize: pagination.pageSize, ...overrides };
      const response = await bookingService.list(params);
      setBookings(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar reservas');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const statusOptions = useMemo(
    () => [
      { label: 'Todas', value: '' },
      { label: 'Pendente', value: 'Pendente' },
      { label: 'Confirmada', value: 'Confirmada' },
      { label: 'Em curso', value: 'Em curso' },
      { label: 'Concluída', value: 'Concluída' },
      { label: 'Cancelada', value: 'Cancelada' },
    ],
    []
  );

  return {
    bookings,
    pagination,
    filters,
    setFilters,
    setPagination,
    isLoading,
    error,
    refetch: fetchBookings,
    statusOptions,
  };
}
