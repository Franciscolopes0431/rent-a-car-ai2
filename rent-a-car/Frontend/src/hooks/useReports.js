import { useCallback, useEffect, useMemo, useState } from 'react';
import * as reportService from '../services/reportService';

export function useReports() {
  const [revenue, setRevenue] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [topVehicles, setTopVehicles] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [utilization, setUtilization] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '', groupBy: 'day', limit: 5 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = { ...filters };
      const [revenueResponse, statusResponse, vehiclesResponse, customersResponse, utilizationResponse] = await Promise.all([
        reportService.revenue(params),
        reportService.bookingsByStatus(params),
        reportService.topVehicles(params),
        reportService.topCustomers(params),
        reportService.fleetUtilization(params),
      ]);

      setRevenue(revenueResponse.data);
      setStatusData(statusResponse.data);
      setTopVehicles(vehiclesResponse.data);
      setTopCustomers(customersResponse.data);
      setUtilization(utilizationResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar relatórios');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const groupingOptions = useMemo(
    () => [
      { label: 'Dia', value: 'day' },
      { label: 'Mês', value: 'month' },
    ],
    []
  );

  return {
    revenue,
    statusData,
    topVehicles,
    topCustomers,
    utilization,
    filters,
    setFilters,
    groupingOptions,
    isLoading,
    error,
    refetch: fetchReports,
  };
}
