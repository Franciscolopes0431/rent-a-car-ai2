const STATUS_MAP = {
  confirmada: 'rc-badge-success',
  pendente: 'rc-badge-warning',
  cancelada: 'rc-badge-danger',
  'em curso': 'rc-badge-info',
  disponivel: 'rc-badge-success',
  disponível: 'rc-badge-success',
  reservado: 'rc-badge-info',
  manutencao: 'rc-badge-danger',
  manutenção: 'rc-badge-danger',
};

function BookingStatusBadge({ status }) {
  const key = (status || '').toLowerCase();
  const className = STATUS_MAP[key] || 'rc-badge-info';

  return <span className={`rc-status-badge ${className}`}>{status}</span>;
}

export default BookingStatusBadge;
