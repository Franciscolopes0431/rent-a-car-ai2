require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await sequelize.authenticate();

    // Em projetos sem migrations, sync cria/atualiza as tabelas com base nos models.
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Servidor a correr em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

bootstrap();