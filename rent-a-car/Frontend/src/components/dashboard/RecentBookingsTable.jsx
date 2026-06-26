import { useMemo } from 'react';
import { Placeholder, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BookingStatusBadge from './BookingStatusBadge';

function RecentBookingsTable({ bookings, isLoading }) {
  const navigate = useNavigate();

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
      }),
    []
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('pt-PT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    []
  );

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return '—';
    }

    return `${dateFormatter.format(new Date(startDate))} – ${dateFormatter.format(new Date(endDate))}`;
  };

  const navigateToBooking = (bookingReference) => {
    navigate(`/admin/reservas/${bookingReference}`);
  };

  const handleRowKeyDown = (event, bookingReference) => {
    if (event.key === 'Enter') {
      navigateToBooking(bookingReference);
    }
  };

  return (
    <section className="rc-card rc-bookings-card">
      <div className="rc-card-header">
        <h2>RESERVAS RECENTES</h2>
        <button type="button" className="rc-inline-link" onClick={() => navigate('/admin/reservas')}>
          Ver todas <i className="bi bi-chevron-right" aria-hidden="true" />
        </button>
      </div>

      {isLoading ? (
        <Placeholder as="div" animation="glow" className="mt-3">
          <Placeholder xs={12} className="mb-2" />
          <Placeholder xs={12} className="mb-2" />
          <Placeholder xs={12} className="mb-2" />
          <Placeholder xs={12} className="mb-2" />
          <Placeholder xs={12} />
        </Placeholder>
      ) : bookings.length === 0 ? (
        <p className="text-secondary mb-0">Sem reservas recentes.</p>
      ) : (
        <Table responsive borderless hover className="rc-bookings-table align-middle mb-0">
          <caption className="visually-hidden">Tabela das reservas recentes da operação</caption>
          <thead>
            <tr>
              <th>ID</th>
              <th>CLIENTE</th>
              <th>VEÍCULO</th>
              <th>DATAS</th>
              <th>TOTAL</th>
              <th>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.reference}
                className="rc-clickable-row"
                role="button"
                tabIndex={0}
                onClick={() => navigateToBooking(booking.reference)}
                onKeyDown={(event) => handleRowKeyDown(event, booking.reference)}
              >
                <td>
                  <span className="rc-booking-id">{booking.reference}</span>
                </td>
                <td>
                  {booking.customer?.firstName} {booking.customer?.lastName}
                </td>
                <td>
                  <span className="rc-vehicle-name">{booking.vehicle?.model}</span>
                  <span className="rc-muted-inline"> • {booking.vehicle?.plate}</span>
                </td>
                <td className="text-secondary">{formatDateRange(booking.startDate, booking.endDate)}</td>
                <td className="fw-semibold">{currencyFormatter.format(Number(booking.totalPrice || 0))}</td>
                <td>
                  <BookingStatusBadge status={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </section>
  );
}

export default RecentBookingsTable;
