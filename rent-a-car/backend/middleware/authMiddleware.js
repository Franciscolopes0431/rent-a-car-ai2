function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Nao autenticado.',
    });
  }

  req.authToken = token;
  return next();
}

module.exports = authMiddleware;
