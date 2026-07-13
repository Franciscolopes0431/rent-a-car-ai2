function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || (err.name === 'SequelizeValidationError' ? 400 : 500);

  if (statusCode === 500) {
    console.error(err);
  }

  return res.status(statusCode).json({
    message: err.message || 'Erro interno do servidor.',
  });
}

module.exports = errorHandler;
