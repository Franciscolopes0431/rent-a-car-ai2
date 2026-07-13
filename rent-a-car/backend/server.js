const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await sequelize.authenticate();

    await sequelize.query(`DO $$ BEGIN
      ALTER TYPE "enum_reservations_estado" ADD VALUE IF NOT EXISTS 'concluida';
    EXCEPTION WHEN undefined_object THEN NULL; END $$;`);

    // Em projetos sem migrations, sync cria/atualiza as tabelas com base nos models.
    await sequelize.sync({ alter: true });
    // Compatibilidade com instalações onde support_tickets foi criada antes dos contactos públicos.
    await sequelize.query('ALTER TABLE "support_tickets" ALTER COLUMN "userId" DROP NOT NULL');

    app.listen(PORT, () => {
      console.log(`Servidor a correr em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

bootstrap();
