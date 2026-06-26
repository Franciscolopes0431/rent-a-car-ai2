const CATEGORY_OPTIONS = ['Compacto', 'Berlina', 'SUV', 'Citadino', 'Desportivo'];
const STATUS_OPTIONS = ['Disponível', 'Reservado', 'Manutenção'];

function validateVehiclePayload(payload, isUpdate = false) {
  const errors = [];
  const { plate, brand, model, pricePerDay, status, category } = payload;

  if (!isUpdate) {
    if (!plate) errors.push('A matrícula é obrigatória');
    if (!brand) errors.push('A marca é obrigatória');
    if (!model) errors.push('O modelo é obrigatório');
    if (pricePerDay === undefined) errors.push('O preço por dia é obrigatório');
  }

  if (plate && !/^[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{2}$/.test(plate)) {
    errors.push('A matrícula deve seguir o formato AA-AA-AA');
  }

  if (pricePerDay !== undefined && Number(pricePerDay) < 0) {
    errors.push('O preço por dia deve ser positivo');
  }

  if (status && !STATUS_OPTIONS.includes(status)) {
    errors.push(`Estado inválido. Use: ${STATUS_OPTIONS.join(', ')}`);
  }

  if (category && !CATEGORY_OPTIONS.includes(category)) {
    errors.push(`Categoria inválida. Use: ${CATEGORY_OPTIONS.join(', ')}`);
  }

  return errors;
}

module.exports = {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  validateVehiclePayload,
};