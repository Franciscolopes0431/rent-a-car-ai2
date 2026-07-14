function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || (err.name === 'SequelizeValidationError' ? 400 : 500);

  if (statusCode === 500) {
    console.error(err);
  }

  return res.status(statusCode).json({
    message: statusCode >= 500 ? 'Ocorreu um erro interno. Tente novamente mais tarde.' : (err.message || 'Pedido inválido.'),
  });
}

module.exports = errorHandler;
