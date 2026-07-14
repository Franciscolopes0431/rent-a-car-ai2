const jwt = require('jsonwebtoken');
const { User } = require('../models');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.trim().length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.');
  }

  return secret;
}

function readCookie(req, name) {
  const entry = String(req.headers.cookie || '')
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!entry) return null;
  try { return decodeURIComponent(entry.slice(name.length + 1)); } catch { return null; }
}

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, bearerToken] = authHeader.split(' ');
  const token = scheme === 'Bearer' ? bearerToken : readCookie(req, 'rentcar_session');

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    const user = await User.findByPk(payload.id, {
      attributes: ['id', 'nome', 'email', 'tipo', 'authVersion'],
    });
    if (!user || Number(payload.authVersion || 0) !== Number(user.authVersion || 0)) {
      return res.status(401).json({ message: 'Sessão inválida ou terminada.' });
    }
    req.user = {
      id: user.id,
      role: user.tipo,
      email: user.email,
      name: user.nome,
      authVersion: user.authVersion,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

function authorize(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated.' });
    if (allowedRoles.length === 0) return next();
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    return next();
  };
}

module.exports = { authenticate, authorize, getJwtSecret, readCookie };
