const express = require('express');
const cors = require('cors');

const vehicleRoutes = require('./routes/vehicleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const unavailabilityRoutes = require('./routes/unavailabilityRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware essenciais para consumo por um frontend React.
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  return res.json({ status: 'ok' });
});

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/unavailability', unavailabilityRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;