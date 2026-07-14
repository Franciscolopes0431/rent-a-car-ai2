export function calculateRentalDays(pickup, returnDate) {
  if (!pickup || !returnDate) return 1;
  return Math.max(1, Math.ceil((new Date(`${returnDate}T00:00:00Z`) - new Date(`${pickup}T00:00:00Z`)) / 86400000));
}

export function validateReservationDates(pickup, returnDate, today = new Date().toISOString().slice(0, 10), maxDays = 30) {
  if (!pickup || !returnDate) return 'Selecione as datas de levantamento e devolução para continuar.';
  if (pickup < today || returnDate <= pickup) return 'Escolha um levantamento a partir de hoje e uma devolução posterior.';
  if (calculateRentalDays(pickup, returnDate) > maxDays) return `A reserva não pode exceder ${maxDays} dias.`;
  return '';
}
