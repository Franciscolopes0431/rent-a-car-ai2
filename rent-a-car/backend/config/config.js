require('dotenv').config({
  path: require('path').resolve(__dirname, '..', '.env'),
});

const baseConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: false,
};

module.exports = {
  development: {
    ...baseConfig,
    dialectOptions:
      process.env.DB_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
            },
          }
        : {},
  },
  test: {
    ...baseConfig,
    database: `${process.env.DB_NAME}_test`,
  },
  production: {
    ...(process.env.DATABASE_URL
      ? { use_env_variable: 'DATABASE_URL', dialect: 'postgres', logging: false }
      : baseConfig),
    dialectOptions:
      process.env.DB_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
            },
          }
        : {},
  },
};
