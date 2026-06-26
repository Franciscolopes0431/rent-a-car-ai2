import { useEffect, useState } from 'react';
import { Badge, Button, Offcanvas, ListGroup } from 'react-bootstrap';
import * as bookingService from '../../services/bookingService';
import StatusBadge from '../../components/common/StatusBadge';

function BookingDetailDrawer({ booking, onHide, onUpdated }) {
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!booking) {
      setDetail(null);
      return;
    }

    async function loadDetail() {
      setIsLoading(true);
      try {
        const response = await bookingService.getById(booking.id);
        setDetail(response.data);
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
        {booking ? (
          <div>
            <div className="mb-4">
              <h5>{detail?.reference || booking.reference}</h5>
              <p className="text-secondary mb-1">{detail?.customer?.firstName} {detail?.customer?.lastName}</p>
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
              <ListGroup.Item>
                <strong>Total</strong>
                <div>{detail ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(detail.totalPrice) : '-'}</div>
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Observações</strong>
                <div>{detail?.notes || 'Nenhuma observação.'}</div>
              </ListGroup.Item>
            </ListGroup>
            <Button variant="warning" className="w-100" onClick={onUpdated}>Atualizar lista</Button>
          </div>
        ) : (
          <p className="text-secondary">Selecione uma reserva para ver detalhes.</p>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default BookingDetailDrawer;
