import { useCallback, useEffect, useMemo, useState } from 'react';
import * as bookingService from '../services/bookingService';

export function useBookings(initialFilters = {}, initialPageSize = 10) {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: initialPageSize, total: 0, totalPages: 0 });
  const [summary, setSummary] = useState({ total: 0, pendente: 0, confirmada: 0, concluida: 0, cancelada: 0 });
  const [filters, setFilters] = useState({ status: '', search: '', from: '', to: '', ...initialFilters });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async (overrides = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const params = { ...filters, page: pagination.page, pageSize: pagination.pageSize, ...overrides };
      const response = await bookingService.list(params);
      const reservations = Array.isArray(response?.data?.data) ? response.data.data : [];
      setBookings(reservations);
      setPagination(response?.data?.pagination || { page: 1, pageSize: 10, total: reservations.length, totalPages: 1 });
      setSummary(response?.data?.summary || { total: reservations.length, pendente: 0, confirmada: 0, concluida: 0, cancelada: 0 });
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
      { label: 'Pendente', value: 'pendente' },
      { label: 'Confirmada', value: 'confirmada' },
      { label: 'Concluída', value: 'concluida' },
      { label: 'Cancelada', value: 'cancelada' },
    ],
    []
  );

  return {
    bookings,
    summary,
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
