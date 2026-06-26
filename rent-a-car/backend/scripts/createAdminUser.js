const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env'),
});

const { sequelize, User } = require('../models');

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@rentcar.pt' },
      defaults: {
        nome: 'Administrador',
        email: 'admin@rentcar.pt',
        password: 'admin123',
        tipo: 'admin',
      },
    });

    if (!created) {
      await user.update({
        nome: 'Administrador',
        password: 'admin123',
        tipo: 'admin',
      });
    }

    console.log(created ? 'Conta admin criada com sucesso.' : 'Conta admin atualizada com sucesso.');
    console.log('Email: admin@rentcar.pt');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Erro ao criar conta admin:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
