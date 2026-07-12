function StatusBadge({ status }) {
  const normalizedStatus = status?.toString()?.toLowerCase() || '';
  const statusMap = {
    // Fleet status
    disponível: 'bg-success',
    reservado: 'bg-warning text-dark',
    manutenção: 'bg-danger',
    // Booking status
    pendente: 'bg-warning text-dark',
    confirmada: 'bg-primary',
    'em curso': 'bg-success',
    concluída: 'bg-secondary',
    cancelada: 'bg-danger',
    // legacy display values
    Pendente: 'bg-warning text-dark',
    Confirmada: 'bg-primary',
    'Em curso': 'bg-success',
    Concluída: 'bg-secondary',
    Cancelada: 'bg-danger',
    Disponível: 'bg-success',
    Reservado: 'bg-warning text-dark',
    Manutenção: 'bg-danger',
  };

  const variant = statusMap[normalizedStatus] || statusMap[status] || 'bg-secondary';
  const displayStatus = status || 'Desconhecido';

  return <span className={`badge ${variant} rc-status-badge`}>{displayStatus}</span>;
}

export default StatusBadge;
