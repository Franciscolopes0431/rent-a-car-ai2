import { Container, Row, Col, Button, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useBookings } from '../../hooks/useBookings';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

function HistoryPage() {
  const { bookings: historyBookings, pagination, setPagination, isLoading, error } = useBookings({ history: 'true' });

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return (
    <Container className="py-4 rc-customer-page">
      <div className="rc-customer-page-header"><div><span className="rc-eyebrow">Arquivo</span><h1>Histórico de Reservas</h1><p>Consulte reservas terminadas ou canceladas e volte a reservar.</p></div></div>

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
                    <td>{booking.vehicle ? `${booking.vehicle.brand} ${booking.vehicle.model}` : `Veículo ${booking.vehicleId}`}</td>
                    <td>
                      <div>{new Date(`${booking.data_inicio}T00:00:00`).toLocaleDateString('pt-PT')}</div>
                      <small className="text-secondary">até {new Date(`${booking.data_fim}T00:00:00`).toLocaleDateString('pt-PT')}</small>
                    </td>
                    <td>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(Number(booking.preco_estimado || 0))}</td>
                    <td><StatusBadge status={booking.estado || booking.status} /></td>
                    <td className="text-end">
                      <Button as={Link} to={`/frota/${booking.vehicleId}`} variant="outline-primary" size="sm" title="Reservar novamente">
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
