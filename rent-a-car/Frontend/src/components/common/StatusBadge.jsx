function StatusBadge({ status }) {
  const statusMap = {
    Disponível: 'badge-success',
    Reservado: 'badge-warning',
    'Em curso': 'badge-info',
    Confirmada: 'badge-primary',
    Pendente: 'badge-secondary',
    Concluída: 'badge-success',
    Cancelada: 'badge-danger',
    Manutenção: 'badge-danger',
  };

  const variant = statusMap[status] || 'badge-secondary';

  return <span className={`badge ${variant} rc-status-badge`}>{status}</span>;
}

export default StatusBadge;
