const { AuditLog } = require('../models');

const ACTIONS = { GET: 'consultar', POST: 'criar', PUT: 'alterar', PATCH: 'alterar_estado', DELETE: 'eliminar' };

function auditMiddleware(req, res, next) {
  const method = req.method.toUpperCase();
  if (!ACTIONS[method]) return next();
  res.on('finish', () => {
    const actor = req.user;
    if (!actor || res.statusCode >= 400) return;
    if (method === 'GET' && !['admin', 'gestor'].includes(actor.role)) return;
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
