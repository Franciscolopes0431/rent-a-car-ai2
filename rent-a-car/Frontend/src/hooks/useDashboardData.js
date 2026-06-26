import { useEffect, useState } from 'react';
import { dashboardMock } from '../api/mockFallback';
import * as bookingService from '../services/bookingService';
import * as dashboardService from '../services/dashboardService';
import * as fleetService from '../services/fleetService';

export function useDashboardData() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const applyMockData = (message = null) => {
      setStats(dashboardMock.stats);
      setRecentBookings(dashboardMock.recentBookings);
      setFleet(dashboardMock.fleet);
      setAlerts(dashboardMock.alerts);
      setError(message);
    };

    (async () => {
      try {
        setIsLoading(true);

        const [statsResponse, bookingsResponse, fleetResponse, alertsResponse] = await Promise.all([
          dashboardService.getStats(),
          bookingService.list({ page: 1, pageSize: 5 }),
          fleetService.getStatus(),
          dashboardService.getAlerts(),
        ]);

        if (cancelled) {
          return;
        }

        setStats(statsResponse.data || dashboardMock.stats);
        setRecentBookings(Array.isArray(bookingsResponse.data?.data) ? bookingsResponse.data.data : []);
        setFleet(fleetResponse.data || dashboardMock.fleet);
        setAlerts(Array.isArray(alertsResponse.data) ? alertsResponse.data : []);
        setError(null);
      } catch (err) {
        if (cancelled) {
          return;
        }

        if (!err.response) {
          applyMockData('Backend indisponível. A mostrar dados mock no dashboard.');
        } else {
          setStats(null);
          setRecentBookings([]);
          setFleet(null);
          setAlerts([]);
          setError(err.response?.data?.message || 'Erro ao carregar dashboard');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, recentBookings, fleet, alerts, isLoading, error };
}
