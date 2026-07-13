const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env'),
});

const { sequelize, User } = require('../models');
const bcrypt = require('bcryptjs');

async function run() {
  try {
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
    if (!adminPassword || adminPassword.length < 12) throw new Error('Defina ADMIN_INITIAL_PASSWORD com pelo menos 12 caracteres.');
    const password = await bcrypt.hash(adminPassword, 10);
    await sequelize.authenticate();
    await sequelize.sync();

    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@rentcar.pt' },
      defaults: {
        nome: 'Administrador',
        email: 'admin@rentcar.pt',
        password,
        tipo: 'admin',
      },
    });

    if (!created) {
      await user.update({
        nome: 'Administrador',
        password,
        tipo: 'admin',
      });
    }

    console.log(created ? 'Conta admin criada com sucesso.' : 'Conta admin atualizada com sucesso.');
    console.log('Email: admin@rentcar.pt');
  } catch (error) {
    console.error('Erro ao criar conta admin:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
