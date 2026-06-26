import { useCallback, useEffect, useMemo, useState } from 'react';
import * as maintenanceService from '../services/maintenanceService';

export function useMaintenance() {
  const [alerts, setAlerts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ resolved: '', vehicleId: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async (overrides = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const params = { ...filters, page: pagination.page, pageSize: pagination.pageSize, ...overrides };
      const response = await maintenanceService.list(params);
      setAlerts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar manutenção');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const typeOptions = useMemo(
    () => [
      { label: 'Todos', value: '' },
      { label: 'Manutenção', value: 'Manutenção' },
      { label: 'Indisponibilidade', value: 'Indisponibilidade' },
      { label: 'Revisão', value: 'Revisão' },
      { label: 'Sinistro', value: 'Sinistro' },
    ],
    []
  );

  return {
    alerts,
    pagination,
    filters,
    setFilters,
    setPagination,
    isLoading,
    error,
    refetch: fetchAlerts,
    typeOptions,
  };
}
