const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const PASSWORD_MESSAGE = 'A palavra-passe deve ter pelo menos 8 caracteres, uma maiúscula, uma minúscula e um número.';

function isStrongPassword(value) {
  return PASSWORD_PATTERN.test(String(value || ''));
}

module.exports = { isStrongPassword, PASSWORD_MESSAGE };
