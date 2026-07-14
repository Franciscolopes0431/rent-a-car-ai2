'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { sequelize } = require('../models');
    await sequelize.sync();

    const users = await queryInterface.describeTable('users');
    if (!users.auth_version) {
      await queryInterface.addColumn('users', 'auth_version', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    }

    const bcrypt = require('bcryptjs');
    const [legacyUsers] = await queryInterface.sequelize.query(
      'SELECT id, password FROM users WHERE password NOT LIKE \'$2%\''
    );
    for (const user of legacyUsers) {
      const hashed = await bcrypt.hash(String(user.password), 10);
      await queryInterface.sequelize.query('UPDATE users SET password = :password WHERE id = :id', {
        replacements: { id: user.id, password: hashed },
      });
    }

    await queryInterface.sequelize.query(`DO $$ BEGIN
      ALTER TYPE "enum_reservations_estado" ADD VALUE IF NOT EXISTS 'concluida';
    EXCEPTION WHEN undefined_object THEN NULL; END $$;`);

    const tables = (await queryInterface.showAllTables()).map(String);
    if (tables.includes('support_tickets')) {
      await queryInterface.changeColumn('support_tickets', 'userId', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const users = await queryInterface.describeTable('users');
    if (users.auth_version) await queryInterface.removeColumn('users', 'auth_version');
  },
};
