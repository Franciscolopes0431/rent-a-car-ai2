function validateCustomerPayload(payload, isUpdate = false) {
  const errors = [];
  const { firstName, lastName, email } = payload;

  if (!isUpdate) {
    if (!firstName) errors.push('O nome é obrigatório');
    if (!lastName) errors.push('O sobrenome é obrigatório');
    if (!email) errors.push('O email é obrigatório');
  }

  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    errors.push('Email inválido');
  }

  return errors;
}

module.exports = {
  validateCustomerPayload,
};