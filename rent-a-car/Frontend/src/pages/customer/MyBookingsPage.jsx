import { Container, Row, Col, Card, Button, Spinner, Form, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookings } from '../../../hooks/useBookings';
import Pagination from '../../common/Pagination';
import EmptyState from '../../common/EmptyState';
import StatusBadge from '../../common/StatusBadge';

function MyBookingsPage() {
  const { bookings, pagination, filters, setFilters, setPagination, isLoading, error, statusOptions } = useBookings();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Filter out completed and cancelled bookings, which belong in History
  const activeBookings = bookings.filter(b => b.status !== 'Concluída' && b.status !== 'Cancelada');

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    // API call to cancel booking
    alert(`Reserva ${selectedBooking.id} cancelada com sucesso.`);
    setShowCancelModal(false);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-2 text-white">As Minhas Reservas</h1>
          <p className="text-secondary">Faça a gestão das suas próximas viagens e reservas em curso.</p>
        </Col>
      </Row>

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
              <option value="Pendente">Pendente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Em curso">Em curso</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}

      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : activeBookings.length === 0 ? (
        <EmptyState 
          title="Sem reservas ativas" 
          description="Não tem nenhuma reserva a decorrer ou planeada. Vá à nossa frota para encontrar o seu próximo carro."
          action={{ label: 'Ver Frota', onClick: () => window.location.href = '/frota' }}
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
                        <small className="text-secondary d-block mb-1">Reserva #{booking.id}</small>
                        <h5 className="text-white mb-0">{booking.vehicle_name || 'Veículo ' + booking.vehicle_id}</h5>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <Row className="mb-4 g-3">
                      <Col xs={6}>
                        <small className="text-secondary d-block">Levantamento</small>
                        <span className="text-white"><i className="bi bi-calendar me-2 text-warning"></i>{new Date(booking.start_date).toLocaleDateString()}</span>
                      </Col>
                      <Col xs={6}>
                        <small className="text-secondary d-block">Devolução</small>
                        <span className="text-white"><i className="bi bi-calendar me-2 text-warning"></i>{new Date(booking.end_date).toLocaleDateString()}</span>
                      </Col>
                      <Col xs={12}>
                        <small className="text-secondary d-block">Total</small>
                        <span className="text-white fw-bold fs-5">€{booking.total_price}</span>
                      </Col>
                    </Row>

                    <div className="d-flex gap-2 mt-auto">
                      <Button variant="outline-primary" className="flex-grow-1" as={Link} to={`/frota/${booking.vehicle_id}`}>
                        Ver Veículo
                      </Button>
                      <Button variant="outline-warning" className="flex-grow-1">
                        Modificar
                      </Button>
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
          <Button variant="danger" onClick={confirmCancel}>
            Confirmar Cancelamento
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyBookingsPage;
