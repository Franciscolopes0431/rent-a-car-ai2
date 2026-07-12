const { Sequelize } = require('sequelize');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env'),
});

// Centraliza a conexao com PostgreSQL para ser reutilizada por toda a aplicacao.
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions:
        process.env.DB_SSL === 'true'
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }
          : {},
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: false,
        dialectOptions:
          process.env.DB_SSL === 'true'
            ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: false,
                },
              }
            : {},
      }
    );

module.exports = sequelize;