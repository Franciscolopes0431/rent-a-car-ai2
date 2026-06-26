const STATUS_OPTIONS = ['Pendente', 'Confirmada', 'Em curso', 'Concluída', 'Cancelada'];

function validateBookingPayload(payload, isUpdate = false) {
  const errors = [];
  const { customerId, vehicleId, startDate, endDate, status } = payload;

  if (!isUpdate) {
    if (!customerId) errors.push('O cliente é obrigatório');
    if (!vehicleId) errors.push('O veículo é obrigatório');
    if (!startDate) errors.push('A data de início é obrigatória');
    if (!endDate) errors.push('A data de fim é obrigatória');
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    errors.push('A data de início não pode ser posterior à data de fim');
  }

  if (status && !STATUS_OPTIONS.includes(status)) {
    errors.push(`Estado inválido. Use: ${STATUS_OPTIONS.join(', ')}`);
  }

  return errors;
}

module.exports = {
  STATUS_OPTIONS,
  validateBookingPayload,
};