import { useMemo, useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import BookingFormModal from './BookingFormModal';
import BookingDetailDrawer from './BookingDetailDrawer';
import { useBookings } from '../../hooks/useBookings';
import * as bookingService from '../../services/bookingService';

function BookingsPage() {
  const { bookings, summary, pagination, filters, setFilters, setPagination, isLoading, error, refetch, statusOptions } = useBookings();
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const actions = [
    {
      key: 'new',
      label: 'Nova Reserva',
      icon: 'bi-plus',
      onClick: () => {
        setEditingBooking(null);
        setShowForm(true);
      },
    },
  ];

  const handleSearch = (value) => setFilters((current) => ({ ...current, search: value }));
  const handleStatus = (status) => setFilters((current) => ({ ...current, status }));
  const handleDateChange = (field) => (value) => setFilters((current) => ({ ...current, [field]: value }));

  const columns = useMemo(
    () => [
      {
        key: 'id',
        label: 'ID',
        render: (booking) => <span className="text-warning fw-semibold">{booking.reference}</span>,
      },
      {
        key: 'customer',
        label: 'CLIENTE',
        render: (booking) => `${booking.customer?.firstName || '---'} ${booking.customer?.lastName || ''}`,
      },
      {
        key: 'vehicle',
        label: 'VEÍCULO',
        render: (booking) => `${booking.vehicle?.brand || '---'} ${booking.vehicle?.model || ''}`,
      },
      {
        key: 'dates',
        label: 'DATAS',
        render: (booking) => (
          <>{new Date(booking.startDate).toLocaleDateString('pt-PT')} – {new Date(booking.endDate).toLocaleDateString('pt-PT')}</>
        ),
      },
      {
        key: 'days',
        label: 'DIAS',
        render: (booking) => {
          const start = new Date(booking.startDate);
          const end = new Date(booking.endDate);
          return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        },
      },
      {
        key: 'totalPrice',
        label: 'TOTAL',
        render: (booking) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(booking.totalPrice),
      },
      { key: 'status', label: 'ESTADO', render: (booking) => <StatusBadge status={booking.status} /> },
      {
        key: 'actions',
        label: 'AÇÕES',
        render: (booking) => (
          <div className="d-flex align-items-center gap-2">
            <Button variant="link" title="Ver detalhes" aria-label={`Ver ${booking.reference}`} className="rc-table-action" onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}><i className="bi bi-eye" /></Button>
            <Button variant="link" title="Editar reserva" aria-label={`Editar ${booking.reference}`} className="rc-table-action" onClick={(e) => { e.stopPropagation(); setEditingBooking(booking); setShowForm(true); }}><i className="bi bi-pencil" /></Button>
            {booking.estado !== 'cancelada' ? <Button variant="link" title="Cancelar reserva" aria-label={`Cancelar ${booking.reference}`} className="rc-table-action is-danger" onClick={(e) => { e.stopPropagation(); setCancelTarget(booking); setShowCancelConfirm(true); }}><i className="bi bi-x-circle" /></Button> : null}
          </div>
        ),
      },
    ],
    []
  );

  const handleCancelConfirmed = async () => {
    if (cancelTarget) {
      setIsCancelling(true);
      setActionError('');
      try {
        await bookingService.cancel(cancelTarget.id);
        setShowCancelConfirm(false);
        setCancelTarget(null);
        setSuccessMessage('Reserva cancelada com sucesso.');
        await refetch();
      } catch (requestError) {
        setActionError(requestError.response?.data?.message || 'Não foi possível cancelar a reserva.');
        setShowCancelConfirm(false);
      } finally {
        setIsCancelling(false);
      }
    }
  };

  const clearFilters = () => {
    setFilters({ status: '', search: '', from: '', to: '' });
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const hasFilters = Boolean(filters.status || filters.search || filters.from || filters.to);

  return (
    <div className="rc-reservations-page">
      <PageHeader title="RESERVAS" subtitle="Acompanhe e faça a gestão de todas as reservas" actions={actions} />

      {error || actionError ? <Alert variant="danger" dismissible onClose={() => setActionError('')}>{actionError || error}</Alert> : null}
      {successMessage ? <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>{successMessage}</Alert> : null}

      <Row className="g-3 mb-4 rc-booking-summary">
        {[
          { label: 'Total', value: summary.total, icon: 'bi-calendar3', status: '' },
          { label: 'Pendentes', value: summary.pendente, icon: 'bi-hourglass-split', status: 'pendente' },
          { label: 'Confirmadas', value: summary.confirmada, icon: 'bi-check-circle', status: 'confirmada' },
          { label: 'Canceladas', value: summary.cancelada, icon: 'bi-x-circle', status: 'cancelada' },
        ].map((item) => (
          <Col sm={6} xl={3} key={item.label}>
            <button type="button" className={`rc-booking-summary-card ${filters.status === item.status ? 'is-active' : ''}`} onClick={() => { setFilters((current) => ({ ...current, status: item.status })); setPagination((current) => ({ ...current, page: 1 })); }}>
              <span><i className={`bi ${item.icon}`} /> {item.label}</span>
              <strong>{item.value ?? 0}</strong>
            </button>
          </Col>
        ))}
      </Row>

      <div className="rc-card rc-booking-filters mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div><h2 className="h6 text-white mb-1">Encontrar reservas</h2><p className="small text-secondary mb-0">Pesquise por referência, cliente, email, viatura ou matrícula.</p></div>
          {hasFilters ? <Button variant="link" className="text-warning text-decoration-none" onClick={clearFilters}>Limpar filtros</Button> : null}
        </div>
        <Row className="gy-3">
          <Col lg={5}>
            <SearchBar value={filters.search} onChange={handleSearch} placeholder="Procurar por referência, cliente ou veículo..." />
          </Col>
          <Col lg={3}>
            <Form.Select value={filters.status} onChange={(event) => handleStatus(event.target.value)}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </Col>
          <Col lg={2}>
            <Form.Group controlId="fromDate">
              <Form.Label>De</Form.Label>
              <Form.Control type="date" value={filters.from} onChange={(event) => handleDateChange('from')(event.target.value)} />
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group controlId="toDate">
              <Form.Label>Até</Form.Label>
              <Form.Control type="date" value={filters.to} onChange={(event) => handleDateChange('to')(event.target.value)} />
            </Form.Group>
          </Col>
        </Row>
      </div>

      {isLoading || bookings.length > 0 ? <div className="rc-card p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={bookings}
          loading={isLoading}
          emptyMessage={error ? error : 'Nenhuma reserva encontrada'}
          onRowClick={(booking) => setSelectedBooking(booking)}
        />
      </div> : null}
      {bookings.length > 0 ? <Pagination
        pagination={pagination}
        onPageChange={(page) => setPagination((current) => ({ ...current, page }))}
        onPageSizeChange={(pageSize) => setPagination((current) => ({ ...current, pageSize, page: 1 }))}
      /> : null}

      {!isLoading && bookings.length === 0 && (
        <EmptyState
          title={hasFilters ? 'Nenhuma reserva corresponde aos filtros' : 'Ainda não existem reservas'}
          description={hasFilters ? 'Ajuste ou limpe os filtros para voltar a ver todas as reservas.' : 'Crie a primeira reserva para começar a gerir a operação.'}
          action={hasFilters ? { label: 'Limpar filtros', onClick: clearFilters } : { label: 'Nova reserva', onClick: () => setShowForm(true) }}
        />
      )}

      <BookingFormModal
        show={showForm}
        booking={editingBooking}
        onHide={() => { setShowForm(false); setEditingBooking(null); }}
        onSaved={() => { setShowForm(false); setEditingBooking(null); refetch(); }}
      />

      <BookingDetailDrawer
        booking={selectedBooking}
        onHide={() => setSelectedBooking(null)}
        onUpdated={() => refetch()}
        onEdit={(booking) => { setSelectedBooking(null); setEditingBooking(booking); setShowForm(true); }}
        onCancel={(booking) => { setSelectedBooking(null); setCancelTarget(booking); setShowCancelConfirm(true); }}
      />

      <ConfirmDialog
        show={showCancelConfirm}
        title="Cancelar reserva"
        message={`Tem a certeza que deseja cancelar ${cancelTarget?.reference}?`}
        onCancel={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelConfirmed}
        isConfirming={isCancelling}
      />
    </div>
  );
}

export default BookingsPage;
