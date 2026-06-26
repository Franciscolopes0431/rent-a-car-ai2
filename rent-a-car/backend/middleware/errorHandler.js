module.exports = (err, req, res, next) => {
  console.error('[API ERROR]', err);

  const status = err.status || 500;
  return res.status(status).json({
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
