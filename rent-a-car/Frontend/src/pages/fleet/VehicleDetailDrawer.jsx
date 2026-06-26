import { useEffect, useMemo, useState } from 'react';
import { Button, Offcanvas, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import * as vehicleService from '../../services/vehicleService';
import StatusBadge from '../../components/common/StatusBadge';

function VehicleDetailDrawer({ vehicle, onHide, onUpdated }) {
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!vehicle) {
      setDetail(null);
      return;
    }

    async function load() {
      setIsLoading(true);
      try {
        const response = await vehicleService.getById(vehicle.id);
        setDetail(response.data);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [vehicle]);

  const stats = useMemo(() => {
    if (!detail) return { reservations: 0, days: 0, revenue: 0 };
    const reservations = detail.bookings?.length || 0;
    const days = detail.bookings?.reduce((sum, booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return sum + Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
    }, 0);
    const revenue = detail.bookings?.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0);
    return { reservations, days, revenue };
  }, [detail]);

  return (
    <Offcanvas show={!!vehicle} onHide={onHide} placement="end" className="rc-detail-drawer">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Detalhe da viatura</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {vehicle && (
          <div>
            <div className="rc-detail-hero mb-4">
              <div className="rc-vehicle-avatar-large mb-3">
                <i className="bi bi-car-front fs-1" aria-hidden="true" />
              </div>
              <h3 className="mb-1">{`${vehicle.brand} ${vehicle.model}`}</h3>
              <p className="text-secondary mb-2">{vehicle.plate}</p>
              <StatusBadge status={vehicle.status} />
            </div>
            <Row className="mb-4">
              <Col>
                <div className="rc-small-card p-3 mb-3">
                  <p className="text-uppercase text-muted small mb-1">Reservas</p>
                  <h4>{stats.reservations}</h4>
                </div>
              </Col>
              <Col>
                <div className="rc-small-card p-3 mb-3">
                  <p className="text-uppercase text-muted small mb-1">Dias alugados</p>
                  <h4>{stats.days}</h4>
                </div>
              </Col>
              <Col>
                <div className="rc-small-card p-3 mb-3">
                  <p className="text-uppercase text-muted small mb-1">Receita</p>
                  <h4>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(stats.revenue)}</h4>
                </div>
              </Col>
            </Row>
            <div className="rc-card p-3 mb-3">
              <h5 className="mb-3">Histórico recente</h5>
              {isLoading ? (
                <p className="text-secondary">A carregar...</p>
              ) : detail.bookings?.length ? (
                <ListGroup variant="flush">
                  {detail.bookings.slice(0, 10).map((booking) => (
                    <ListGroup.Item key={booking.id} className="rc-list-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{booking.reference}</strong>
                          <div className="small text-secondary">{booking.customer?.firstName} {booking.customer?.lastName}</div>
                        </div>
                        <Badge bg="secondary">{booking.status}</Badge>
                      </div>
                      <div className="small text-secondary">{new Date(booking.startDate).toLocaleDateString('pt-PT')} – {new Date(booking.endDate).toLocaleDateString('pt-PT')}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-secondary">Ainda sem reservas para esta viatura.</p>
              )}
            </div>
            <Button variant="warning" onClick={onUpdated} className="w-100">Atualizar lista</Button>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default VehicleDetailDrawer;
