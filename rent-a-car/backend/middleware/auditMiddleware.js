const jwt = require('jsonwebtoken');
const { AuditLog } = require('../models');
const { getJwtSecret } = require('./authMiddleware');

const ACTIONS = { POST: 'criar', PUT: 'alterar', PATCH: 'alterar_estado', DELETE: 'eliminar' };

function getToken(req) {
  const [scheme, bearer] = String(req.headers.authorization || '').split(' ');
  if (scheme === 'Bearer') return bearer;
  const cookies = Object.fromEntries(String(req.headers.cookie || '').split(';').map((part) => part.trim().split('=').map(decodeURIComponent)).filter((part) => part.length === 2));
  return cookies.rentcar_session;
}

function auditMiddleware(req, res, next) {
  const method = req.method.toUpperCase();
  if (!ACTIONS[method]) return next();
  let actor = null;
  try { actor = jwt.verify(getToken(req), getJwtSecret()); } catch { actor = null; }
  res.on('finish', () => {
    if (!actor || res.statusCode >= 400) return;
    const path = String(req.originalUrl || req.url).split('?')[0];
    const segments = path.split('/').filter(Boolean);
    const entityId = [...segments].reverse().find((segment) => /^\d+$/.test(segment)) || null;
    AuditLog.create({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: ACTIONS[method],
      method,
      path,
      entityId,
      statusCode: res.statusCode,
      ipAddress: req.ip || req.socket?.remoteAddress || null,
    }).catch((error) => console.error('Não foi possível registar a auditoria:', error.message));
  });
  return next();
}

module.exports = auditMiddleware;
