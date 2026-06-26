const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env'),
});

const { sequelize } = require('../models');

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    await sequelize.query(`
      ALTER TABLE vehicles
        ADD COLUMN IF NOT EXISTS plate VARCHAR(15),
        ADD COLUMN IF NOT EXISTS brand VARCHAR(80),
        ADD COLUMN IF NOT EXISTS model VARCHAR(80),
        ADD COLUMN IF NOT EXISTS category VARCHAR(20) DEFAULT 'Compacto',
        ADD COLUMN IF NOT EXISTS price_per_day DECIMAL(10,2),
        ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Disponível',
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
    `);

    await sequelize.query(`
      UPDATE vehicles
      SET plate = COALESCE(plate, matricula),
          brand = COALESCE(brand, marca),
          model = COALESCE(model, modelo),
          price_per_day = COALESCE(price_per_day, preco_diario),
          status = COALESCE(status, estado),
          category = COALESCE(category, 'Compacto'),
          created_at = COALESCE(created_at, createdAt),
          updated_at = COALESCE(updated_at, updatedAt)
      WHERE plate IS NULL
         OR brand IS NULL
         OR model IS NULL
         OR price_per_day IS NULL
         OR status IS NULL
         OR category IS NULL
         OR created_at IS NULL
         OR updated_at IS NULL;
    `);

    console.log('Esquema sincronizado e dados legados migrados com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar esquema:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
