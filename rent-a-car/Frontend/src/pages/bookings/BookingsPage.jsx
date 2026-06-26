import { useMemo, useState } from 'react';
import { Button, Col, Form, Row, Badge } from 'react-bootstrap';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
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
  const { bookings, pagination, filters, setFilters, setPagination, isLoading, error, refetch, statusOptions } = useBookings();
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const actions = [
    {
      key: 'new',
      label: '+ Nova Reserva',
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
          return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
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
            <Button variant="link" className="text-secondary p-0" onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}><i className="bi bi-eye" /></Button>
            <Button variant="link" className="text-secondary p-0" onClick={(e) => { e.stopPropagation(); setEditingBooking(booking); setShowForm(true); }}><i className="bi bi-pencil" /></Button>
            <Button variant="link" className="text-danger p-0" onClick={(e) => { e.stopPropagation(); setCancelTarget(booking); setShowCancelConfirm(true); }}><i className="bi bi-x-circle" /></Button>
          </div>
        ),
      },
    ],
    []
  );

  const handleCancelConfirmed = async () => {
    if (cancelTarget) {
      await bookingService.cancel(cancelTarget.id);
      setShowCancelConfirm(false);
      setCancelTarget(null);
      refetch();
    }
  };

  return (
    <div>
      <PageHeader
        title="RESERVAS"
        subtitle={`${pagination.total || bookings.length} reservas · ${bookings.filter((booking) => ['Confirmada', 'Em curso'].includes(booking.status)).length} ativas`}
        actions={actions}
      />

      <div className="rc-card p-4 mb-4">
        <Row className="gy-3">
          <Col lg={4}>
            <SearchBar value={filters.search} onChange={handleSearch} placeholder="Procurar por referência, cliente ou veículo..." />
          </Col>
          <Col lg={4}>
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

      <div className="rc-card p-0">
        <DataTable
          columns={columns}
          data={bookings}
          loading={isLoading}
          emptyMessage={error ? error : 'Nenhuma reserva encontrada'}
          onRowClick={(booking) => setSelectedBooking(booking)}
        />
      </div>
      <Pagination
        pagination={pagination}
        onPageChange={(page) => setPagination((current) => ({ ...current, page }))}
        onPageSizeChange={(pageSize) => setPagination((current) => ({ ...current, pageSize, page: 1 }))}
      />

      {!isLoading && bookings.length === 0 && (
        <EmptyState
          title="Sem reservas no momento"
          description="Crie uma nova reserva para começar a gerir clientes e frota de forma real." 
          action={{ label: 'Nova reserva', onClick: () => setShowForm(true) }}
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
      />

      <ConfirmDialog
        show={showCancelConfirm}
        title="Cancelar reserva"
        message={`Tem a certeza que deseja cancelar ${cancelTarget?.reference}?`}
        onCancel={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelConfirmed}
      />
    </div>
  );
}

export default BookingsPage;
