const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const apiRoutes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const auditMiddleware = require('./middleware/auditMiddleware');

const app = express();
app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS || 1));

const configuredOrigins = String(process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (configuredOrigins.includes(origin)) return true;
  if (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return true;
  return false;
}

// Middleware essenciais para consumo por um frontend React.
app.use(
  cors({
    origin(origin, callback) {
      const allowed = isAllowedOrigin(origin);
      callback(allowed ? null : new Error('Origem não permitida por CORS.'), allowed);
    },
    credentials: true,
  })
);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "img-src": ["'self'", 'data:', 'https:'],
      "style-src": ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      "font-src": ["'self'", 'data:', 'https://fonts.gstatic.com'],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) || !String(req.headers.cookie || '').includes('rentcar_session=')) return next();
  const origin = req.get('origin');
  if (origin && isAllowedOrigin(origin)) return next();
  if (!origin && process.env.NODE_ENV !== 'production') return next();
  return res.status(403).json({ message: 'Origem do pedido não autorizada.' });
});
app.use(auditMiddleware);

app.get('/health', (req, res) => {
  return res.json({ status: 'ok' });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
