import { useEffect, useState } from 'react';
import { Alert, Button, Offcanvas, ListGroup, Spinner } from 'react-bootstrap';
import * as bookingService from '../../services/bookingService';
import StatusBadge from '../../components/common/StatusBadge';

function BookingDetailDrawer({ booking, onHide, onEdit, onCancel }) {
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!booking) {
      setDetail(null);
      setError('');
      return;
    }

    async function loadDetail() {
      setIsLoading(true);
      try {
        const response = await bookingService.getById(booking.id);
        setDetail(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Não foi possível carregar os detalhes.');
      } finally {
        setIsLoading(false);
      }
    }

    loadDetail();
  }, [booking]);

  return (
    <Offcanvas show={!!booking} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Detalhes da reserva</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {isLoading ? <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div> : error ? <Alert variant="danger">{error}</Alert> : booking ? (
          <div>
            <div className="mb-4">
              <h5>{detail?.reference || booking.reference}</h5>
              <p className="text-secondary mb-1">{detail?.customer?.firstName} {detail?.customer?.lastName}</p>
              <p className="small text-secondary mb-2">{detail?.customer?.email}</p>
              <StatusBadge status={detail?.status || booking.status} />
            </div>
            <ListGroup variant="flush" className="mb-4">
              <ListGroup.Item>
                <strong>Veículo</strong>
                <div>{detail?.vehicle?.brand} {detail?.vehicle?.model} ({detail?.vehicle?.plate})</div>
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Período</strong>
                <div>{new Date(detail?.startDate || booking.startDate).toLocaleDateString('pt-PT')} – {new Date(detail?.endDate || booking.endDate).toLocaleDateString('pt-PT')}</div>
              </ListGroup.Item>
              <ListGroup.Item><strong>Local de levantamento</strong><div>{detail?.pickupLocation || 'Não indicado'}</div></ListGroup.Item>
              <ListGroup.Item>
                <strong>Total</strong>
                <div>{detail ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(detail.totalPrice) : '-'}</div>
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Criada em</strong>
                <div>{detail?.createdAt ? new Date(detail.createdAt).toLocaleString('pt-PT') : '—'}</div>
              </ListGroup.Item>
            </ListGroup>
            <div className="d-grid gap-2">
              <Button variant="warning" onClick={() => onEdit(detail || booking)}><i className="bi bi-pencil me-2" />Editar reserva</Button>
              {(detail?.estado || booking.estado) !== 'cancelada' ? <Button variant="outline-danger" onClick={() => onCancel(detail || booking)}><i className="bi bi-x-circle me-2" />Cancelar reserva</Button> : null}
            </div>
          </div>
        ) : (
          <p className="text-secondary">Selecione uma reserva para ver detalhes.</p>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default BookingDetailDrawer;
