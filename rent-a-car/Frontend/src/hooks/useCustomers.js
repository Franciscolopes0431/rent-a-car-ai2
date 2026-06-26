import { useCallback, useEffect, useMemo, useState } from 'react';
import * as customerService from '../services/customerService';

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async (overrides = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const params = { search, page: pagination.page, pageSize: pagination.pageSize, ...overrides };
      const response = await customerService.list(params);
      setCustomers(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  }, [search, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filters = useMemo(() => ({ search }), [search]);

  return {
    customers,
    pagination,
    filters,
    search,
    setSearch,
    setPagination,
    isLoading,
    error,
    refetch: fetchCustomers,
  };
}
