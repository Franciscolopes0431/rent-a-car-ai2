import { useCallback, useEffect, useMemo, useState } from 'react';
import * as vehicleService from '../services/vehicleService';

export function useFleet() {
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ status: '', category: '', search: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async (overrides = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const params = { ...filters, page: pagination.page, pageSize: pagination.pageSize, ...overrides };
      const response = await vehicleService.list(params);
      setVehicles(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar viaturas');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const statusOptions = useMemo(
    () => [
      { label: 'Todas', value: '' },
      { label: 'Disponível', value: 'Disponível' },
      { label: 'Reservado', value: 'Reservado' },
      { label: 'Manutenção', value: 'Manutenção' },
    ],
    []
  );

  const categoryOptions = useMemo(
    () => [
      { label: 'Todas', value: '' },
      { label: 'Compacto', value: 'Compacto' },
      { label: 'Berlina', value: 'Berlina' },
      { label: 'SUV', value: 'SUV' },
      { label: 'Citadino', value: 'Citadino' },
      { label: 'Desportivo', value: 'Desportivo' },
    ],
    []
  );

  return {
    vehicles,
    pagination,
    filters,
    setFilters,
    setPagination,
    isLoading,
    error,
    refetch: fetchVehicles,
    statusOptions,
    categoryOptions,
  };
}
