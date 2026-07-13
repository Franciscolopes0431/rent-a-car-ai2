const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const auditMiddleware = require('./middleware/auditMiddleware');

const app = express();

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
      callback(isAllowedOrigin(origin) ? null : new Error('Origem não permitida por CORS.'), isAllowedOrigin(origin));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(auditMiddleware);

app.get('/health', (req, res) => {
  return res.json({ status: 'ok' });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
