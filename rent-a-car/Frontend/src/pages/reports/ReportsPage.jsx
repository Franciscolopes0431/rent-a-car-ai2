import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import EmptyState from '../../components/common/EmptyState';
import { useReports } from '../../hooks/useReports';

function ReportsPage() {
  const { revenue, statusData, topVehicles, topCustomers, utilization, filters, setFilters, groupingOptions, isLoading, error, refetch } = useReports();
  const [currentGroup, setCurrentGroup] = useState(filters.groupBy);

  useEffect(() => {
    setCurrentGroup(filters.groupBy);
  }, [filters.groupBy]);

  const revenueTable = useMemo(
    () => [
      { key: 'period', label: 'Período' },
      { key: 'value', label: 'Receita', render: (item) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.value) },
    ],
    []
  );

  const topVehicleColumns = useMemo(
    () => [
      { key: 'vehicle', label: 'VEÍCULO', render: (item) => `${item.brand} ${item.model}` },
      { key: 'totalRentals', label: 'RESERVAS' },
      { key: 'revenue', label: 'RECEITA', render: (item) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.revenue) },
    ],
    []
  );

  const topCustomerColumns = useMemo(
    () => [
      { key: 'customer', label: 'CLIENTE', render: (item) => `${item.firstName} ${item.lastName}` },
      { key: 'bookings', label: 'RESERVAS' },
      { key: 'spent', label: 'GASTO', render: (item) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.spent) },
    ],
    []
  );

  const statusColumns = useMemo(
    () => [
      { key: 'status', label: 'ESTADO' },
      { key: 'count', label: 'QUANTIDADE' },
    ],
    []
  );

  const utilizationColumns = useMemo(
    () => [
      { key: 'category', label: 'CATEGORIA' },
      { key: 'utilization', label: 'UTILIZAÇÃO', render: (item) => `${item.utilization}%` },
    ],
    []
  );

  const handleRefresh = () => refetch();

  return (
    <div>
      <PageHeader title="RELATÓRIOS" subtitle="Visão geral das operações e da frota" actions={[{ key: 'refresh', label: 'Atualizar', icon: 'bi-arrow-clockwise', onClick: handleRefresh }]} />

      <div className="rc-card p-4 mb-4">
        <Row className="gy-3 align-items-end">
          <Col lg={3}>
            <Form.Label>De</Form.Label>
            <Form.Control type="date" value={filters.from} onChange={(e) => setFilters((current) => ({ ...current, from: e.target.value }))} />
          </Col>
          <Col lg={3}>
            <Form.Label>Até</Form.Label>
            <Form.Control type="date" value={filters.to} onChange={(e) => setFilters((current) => ({ ...current, to: e.target.value }))} />
          </Col>
          <Col lg={3}>
            <Form.Label>Agrupar por</Form.Label>
            <Form.Select value={currentGroup} onChange={(e) => setFilters((current) => ({ ...current, groupBy: e.target.value }))}>
              {groupingOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </Col>
          <Col lg={3} className="text-end">
            <Button variant="outline-secondary" onClick={handleRefresh}>Atualizar relatórios</Button>
          </Col>
        </Row>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <Row className="g-4">
        <Col lg={4}>
          <Card className="rc-card p-4 h-100">
            <Card.Body>
              <Card.Title>Receita total</Card.Title>
              <Card.Text className="display-6">
                {revenue.reduce((sum, item) => sum + Number(item.value || 0), 0).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="rc-card p-4 h-100">
            <Card.Body>
              <Card.Title>Utilização média</Card.Title>
              <Card.Text className="display-6">
                {utilization.length ? `${(utilization.reduce((sum, item) => sum + Number(item.utilization || 0), 0) / utilization.length).toFixed(0)}%` : '0%'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="rc-card p-4 h-100">
            <Card.Body>
              <Card.Title>Reservas por estado</Card.Title>
              <Card.Text>{statusData.reduce((sum, item) => sum + Number(item.count || 0), 0)} reservas</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        <Col xl={6}>
          <Card className="rc-card p-3 h-100">
            <Card.Title>Receita por período</Card.Title>
            <Table striped hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Período</th>
                  <th>Receita</th>
                </tr>
              </thead>
              <tbody>
                {revenue.map((item) => (
                  <tr key={item.period}>
                    <td>{item.period}</td>
                    <td>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.value)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="rc-card p-3 h-100">
            <Card.Title>Distribuição de reservas</Card.Title>
            <Table striped hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {statusData.map((item) => (
                  <tr key={item.status}>
                    <td>{item.status}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        <Col xl={6}>
          <Card className="rc-card p-3 h-100">
            <Card.Title>Veículos mais rentáveis</Card.Title>
            <Table striped hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th>Reservas</th>
                  <th>Receita</th>
                </tr>
              </thead>
              <tbody>
                {topVehicles.map((item) => (
                  <tr key={`${item.brand}-${item.model}-${item.id}`}>
                    <td>{`${item.brand} ${item.model}`}</td>
                    <td>{item.totalRentals}</td>
                    <td>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="rc-card p-3 h-100">
            <Card.Title>Clientes top</Card.Title>
            <Table striped hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Reservas</th>
                  <th>Gasto</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((item) => (
                  <tr key={`${item.firstName}-${item.lastName}-${item.id}`}>
                    <td>{`${item.firstName} ${item.lastName}`}</td>
                    <td>{item.bookings}</td>
                    <td>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.spent)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ReportsPage;
