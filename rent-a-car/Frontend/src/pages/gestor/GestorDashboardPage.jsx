import { useMemo, useState } from 'react';
import { Alert, Button, Col, Offcanvas, Row } from 'react-bootstrap';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import AlertsPanel from '../../components/dashboard/AlertsPanel';
import FleetStatusPanel from '../../components/dashboard/FleetStatusPanel';
import QuickAccessPanel from '../../components/dashboard/QuickAccessPanel';
import RecentBookingsTable from '../../components/dashboard/RecentBookingsTable';
import StatCard from '../../components/dashboard/StatCard';
import { useDashboardData } from '../../hooks/useDashboardData';

function GestorDashboardPage() {
  const { stats, recentBookings, fleet, alerts, isLoading, error } = useDashboardData();
  const [showHelp, setShowHelp] = useState(false);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
      }),
    []
  );

  const monthLabel = useMemo(
    () =>
      new Date().toLocaleDateString('pt-PT', {
        month: 'long',
        year: 'numeric',
      }),
    []
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const revenueChange = stats?.revenueChangePct;

  return (
    <div className="rc-dashboard-page">
      {error ? (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      ) : null}

      <Row className="g-3 mb-4">
        <Col md={6} xl={3}>
          <StatCard
            label="Total Veículos"
            value={stats?.totalVehicles ?? 0}
            footer={`+${stats?.vehiclesAddedThisMonth ?? 0} este mês`}
            icon="bi-car-front"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatCard
            label="Reservas Ativas"
            value={stats?.activeBookings ?? 0}
            footer={`${stats?.bookingsEndingToday ?? 0} a encerrar hoje`}
            icon="bi-calendar"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatCard
            label="Reservas Pendentes"
            value={stats?.pendingBookings ?? 0}
            footer="Aguardam confirmação"
            icon="bi-clock"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatCard
            label={`Receita ${monthLabel}`}
            value={currencyFormatter.format(stats?.monthRevenue ?? 0)}
            footer={
              revenueChange !== null && revenueChange !== undefined
                ? `${revenueChange >= 0 ? '+' : ''}${revenueChange}% vs. mês anterior`
                : '—'
            }
            footerVariant={revenueChange >= 0 ? 'success' : 'danger'}
            icon="bi-graph-up-arrow"
          />
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col xl={8}>
          <RecentBookingsTable bookings={recentBookings} isLoading={isLoading} />
        </Col>
        <Col xl={4}>
          <FleetStatusPanel fleet={fleet} isLoading={isLoading} />
        </Col>
      </Row>

      <Row className="g-3">
        <Col xl={7}>
          <AlertsPanel alerts={alerts} isLoading={isLoading} />
        </Col>
        <Col xl={5}>
          <QuickAccessPanel isLoading={isLoading} />
        </Col>
      </Row>

      <Button
        type="button"
        className="rc-help-fab"
        aria-label="Abrir ajuda"
        onClick={() => setShowHelp(true)}
      >
        <i className="bi bi-question-lg" aria-hidden="true" />
      </Button>

      <Offcanvas
        show={showHelp}
        onHide={() => setShowHelp(false)}
        placement="end"
        className="rc-support-offcanvas"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Ajuda e Suporte</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p className="mb-2">FAQ rápida:</p>
          <ul className="ps-3">
            <li>Gestão de reservas em /gestor/reservas</li>
            <li>Estado de frota em /gestor/frota</li>
            <li>Suporte interno: suporte@rentcar.pt</li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default GestorDashboardPage;
