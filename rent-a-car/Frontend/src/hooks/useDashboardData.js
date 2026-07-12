import { useEffect, useState } from 'react';
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

        setStats(statsResponse.data || null);
        setRecentBookings(Array.isArray(bookingsResponse.data?.data) ? bookingsResponse.data.data : []);
        const vehicles = Array.isArray(fleetResponse.data?.data) ? fleetResponse.data.data : [];
        setFleet({
          summary: {
            available: vehicles.filter((vehicle) => vehicle.status === 'Disponível').length,
            reserved: vehicles.filter((vehicle) => vehicle.status === 'Reservado').length,
            maintenance: vehicles.filter((vehicle) => vehicle.status === 'Manutenção').length,
          },
          vehicles: vehicles.slice(0, 5),
        });
        setAlerts(Array.isArray(alertsResponse.data) ? alertsResponse.data : []);
        setError(null);
      } catch (err) {
        if (cancelled) {
          return;
        }

        setStats(null);
        setRecentBookings([]);
        setFleet([]);
        setAlerts([]);
        setError(err.response?.data?.message || 'Erro ao carregar dashboard');
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
