const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

const app = require('./app');
const { sequelize } = require('./models');
const { runReservationLifecycle } = require('./services/reservationLifecycleService');

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await sequelize.authenticate();

    await runReservationLifecycle();
    const lifecycleTimer = setInterval(() => {
      runReservationLifecycle().catch((error) => console.error('Erro no ciclo de reservas:', error.message));
    }, 5 * 60 * 1000);
    lifecycleTimer.unref();

    app.listen(PORT, () => {
      console.log(`Servidor a correr em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

bootstrap();
