function StatusBadge({ status }) {
  const statusMap = {
    // Fleet status
    Disponível: 'bg-success',
    Reservado: 'bg-warning text-dark',
    Manutenção: 'bg-danger',
    // Booking status
    Pendente: 'bg-warning text-dark',
    Confirmada: 'bg-primary',
    'Em curso': 'bg-success',
    Concluída: 'bg-secondary',
    Cancelada: 'bg-danger',
  };

  const variant = statusMap[status] || 'bg-secondary';

  return <span className={`badge ${variant} rc-status-badge`}>{status}</span>;
}

export default StatusBadge;
