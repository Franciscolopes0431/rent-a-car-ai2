import { Container, Row, Col, Card, Button, Spinner, Form, Modal, Alert } from 'react-bootstrap';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookings } from '../../hooks/useBookings';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import * as bookingService from '../../services/bookingService';

function MyBookingsPage() {
  const { bookings, pagination, filters, setFilters, setPagination, isLoading, error, refetch } = useBookings();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [apiError, setApiError] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDates, setEditDates] = useState({ data_inicio: '', data_fim: '' });
  const [isSaving, setIsSaving] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const activeBookings = useMemo(
    () => bookings.filter((booking) => (booking.estado || booking.status) !== 'cancelada' && booking.data_fim >= today),
    [bookings]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleEditClick = (booking) => {
    setSelectedBooking(booking);
    setEditDates({ data_inicio: booking.data_inicio, data_fim: booking.data_fim });
    setApiError('');
    setShowEditModal(true);
  };

  const confirmEdit = async () => {
    if (!selectedBooking || editDates.data_inicio < today || editDates.data_fim <= editDates.data_inicio) {
      setApiError('Escolha um levantamento a partir de hoje e uma devolução posterior.');
      return;
    }

    setIsSaving(true);
    setApiError('');
    try {
      await bookingService.update(selectedBooking.id, editDates);
      setShowEditModal(false);
      setSelectedBooking(null);
      setSuccessMessage('Reserva atualizada com sucesso.');
      await refetch();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Não foi possível atualizar a reserva.');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmCancel = async () => {
    if (!selectedBooking) {
      return;
    }

    setApiError('');
    setSuccessMessage('');
    setIsCancelling(true);

    try {
      await bookingService.cancel(selectedBooking.id);
      setShowCancelModal(false);
      setSelectedBooking(null);
      setSuccessMessage('Reserva cancelada com sucesso.');
      await refetch();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Não foi possível cancelar a reserva.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Container className="py-4 rc-customer-page">
      <div className="rc-customer-page-header"><div><span className="rc-eyebrow">As suas viagens</span><h1>As Minhas Reservas</h1><p>Consulte, altere ou cancele as próximas reservas.</p></div><Button as={Link} to="/frota" variant="warning"><i className="bi bi-plus-lg me-2" />Nova reserva</Button></div>

      <Row className="mb-4">
        <Col lg={4}>
          <Form.Group>
            <Form.Select 
              name="status"
              value={filters.status || ''}
              onChange={handleFilterChange}
              className="bg-dark text-white border-secondary"
            >
              <option value="">Todos os Estados</option>
              <option value="pendente">Pendentes</option>
              <option value="confirmada">Confirmadas</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}
      {successMessage && (
        <Alert variant="success" className="mb-3">{successMessage}</Alert>
      )}
      {apiError && (
        <Alert variant="danger" className="mb-3">{apiError}</Alert>
      )}

      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : activeBookings.length === 0 ? (
        <EmptyState 
          title="Sem reservas ativas" 
          description="Não tem nenhuma reserva a decorrer ou planeada. Vá à nossa frota para encontrar o seu próximo carro."
          action={{ label: 'Ver Frota', to: '/frota' }}
        />
      ) : (
        <>
          <Row className="g-4">
            {activeBookings.map((booking) => (
              <Col lg={6} key={booking.id}>
                <Card className="rc-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3 border-bottom border-secondary pb-3">
                      <div>
                        <small className="text-secondary d-block mb-1">Reserva #{booking.reference || booking.id}</small>
                        <h5 className="text-white mb-0">{booking.vehicle?.brand || booking.vehicle_name || 'Veículo ' + (booking.vehicleId || booking.vehicle_id)}</h5>
                      </div>
                      <StatusBadge status={booking.estado || booking.status} />
                    </div>

                    <Row className="mb-4 g-3">
                      <Col xs={6}>
                        <small className="text-secondary d-block">Levantamento</small>
                        <span className="text-white"><i className="bi bi-calendar me-2 text-warning"></i>{new Date(`${booking.data_inicio}T00:00:00`).toLocaleDateString('pt-PT')}</span>
                      </Col>
                      <Col xs={6}>
                        <small className="text-secondary d-block">Devolução</small>
                        <span className="text-white"><i className="bi bi-calendar me-2 text-warning"></i>{new Date(`${booking.data_fim}T00:00:00`).toLocaleDateString('pt-PT')}</span>
                      </Col>
                      <Col xs={12}>
                        <small className="text-secondary d-block">Total</small>
                        <span className="text-white fw-bold fs-5">{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(Number(booking.preco_estimado || 0))}</span>
                      </Col>
                      {booking.extras && (booking.extras.gps || booking.extras.insurance || booking.extras.childSeat > 0) ? <Col xs={12}><small className="text-secondary d-block mb-1">Extras</small><span className="small text-white">{[booking.extras.gps && 'GPS', booking.extras.insurance && 'Cobertura total', booking.extras.childSeat > 0 && `${booking.extras.childSeat} cadeira(s) de criança`].filter(Boolean).join(' · ')}</span></Col> : null}
                    </Row>

                    <div className="d-flex gap-2 mt-auto">
                      <Button variant="outline-primary" className="flex-grow-1" as={Link} to={`/frota/${booking.vehicleId || booking.vehicle_id}`}>
                        Ver Veículo
                      </Button>
                      {(booking.estado || booking.status) === 'pendente' ? <Button variant="outline-warning" className="flex-grow-1" onClick={() => handleEditClick(booking)}>
                        Modificar
                      </Button> : null}
                      <Button variant="outline-danger" className="flex-grow-1" onClick={() => handleCancelClick(booking)}>
                        Cancelar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="mt-4">
             <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => setPagination({ ...pagination, pageSize: size, page: 1 })}
              />
          </div>
        </>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title>Modificar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {apiError ? <Alert variant="danger">{apiError}</Alert> : null}
          <Form.Group className="mb-3">
            <Form.Label>Data de levantamento</Form.Label>
            <Form.Control type="date" min={today} value={editDates.data_inicio} onChange={(event) => setEditDates({ ...editDates, data_inicio: event.target.value, data_fim: editDates.data_fim <= event.target.value ? '' : editDates.data_fim })} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Data de devolução</Form.Label>
            <Form.Control type="date" min={editDates.data_inicio || today} value={editDates.data_fim} onChange={(event) => setEditDates({ ...editDates, data_fim: event.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" onClick={() => setShowEditModal(false)}>Voltar</Button>
          <Button variant="warning" onClick={confirmEdit} disabled={isSaving}>{isSaving ? 'A guardar...' : 'Guardar alterações'}</Button>
        </Modal.Footer>
      </Modal>

      {/* Cancel Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title>Cancelar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem a certeza que deseja cancelar a reserva <strong>#{selectedBooking?.id}</strong>?</p>
          <div className="alert alert-warning mb-0 border-warning text-dark">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Atenção: Cancelamentos a menos de 48h do levantamento podem estar sujeitos a uma taxa de retenção conforme os Termos e Condições.
          </div>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" onClick={() => setShowCancelModal(false)}>
            Voltar
          </Button>
          <Button variant="danger" onClick={confirmCancel} disabled={isCancelling}>
            {isCancelling ? 'A cancelar...' : 'Confirmar Cancelamento'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyBookingsPage;
