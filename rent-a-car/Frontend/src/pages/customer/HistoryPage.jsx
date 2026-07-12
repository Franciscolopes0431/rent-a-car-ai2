import { Container, Row, Col, Card, Button, Spinner, Table } from 'react-bootstrap';
import { useBookings } from '../../hooks/useBookings';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

function HistoryPage() {
  const { bookings, pagination, setPagination, isLoading, error } = useBookings();

  // Filter only completed and cancelled bookings for History
  const historyBookings = bookings.filter(b => b.status === 'Concluída' || b.status === 'Cancelada');

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-2 text-white">Histórico de Reservas</h1>
          <p className="text-secondary">Consulte as suas reservas passadas e descarregue faturas.</p>
        </Col>
      </Row>

      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}

      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : historyBookings.length === 0 ? (
        <EmptyState 
          title="Histórico Vazio" 
          description="Ainda não tem reservas concluídas ou canceladas no seu histórico."
        />
      ) : (
        <div className="rc-card p-0 overflow-hidden">
          <div className="table-responsive">
            <Table variant="dark" hover className="mb-0 align-middle rc-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Veículo</th>
                  <th>Datas</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {historyBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>
                    <td>{booking.vehicle_name || `Veículo ${booking.vehicle_id}`}</td>
                    <td>
                      <div>{new Date(booking.start_date).toLocaleDateString()}</div>
                      <small className="text-secondary">até {new Date(booking.end_date).toLocaleDateString()}</small>
                    </td>
                    <td>€{booking.total_price}</td>
                    <td><StatusBadge status={booking.status} /></td>
                    <td className="text-end">
                      <Button variant="outline-secondary" size="sm" className="me-2" title="Descarregar Fatura">
                        <i className="bi bi-file-earmark-pdf"></i>
                      </Button>
                      <Button variant="outline-primary" size="sm" title="Repetir Reserva">
                        <i className="bi bi-arrow-repeat me-1"></i>Repetir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="p-3 border-top border-secondary bg-dark">
             <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => setPagination({ ...pagination, pageSize: size, page: 1 })}
              />
          </div>
        </div>
      )}
    </Container>
  );
}

export default HistoryPage;
