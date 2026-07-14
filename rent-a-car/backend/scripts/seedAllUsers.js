const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');
const { isStrongPassword, PASSWORD_MESSAGE } = require('../utils/passwordPolicy');

async function run() {
  try {
    const seedPassword = process.env.SEED_USER_PASSWORD;
    if (!isStrongPassword(seedPassword) || seedPassword.length < 12) throw new Error(`${PASSWORD_MESSAGE} Para contas iniciais use pelo menos 12 caracteres.`);
    await sequelize.authenticate();
    await sequelize.sync();

    const usersToCreate = [
      { nome: 'Administrador', email: 'admin@rentcar.pt', password: seedPassword, tipo: 'admin' },
      { nome: 'Gestor', email: 'gestor@rentcar.pt', password: seedPassword, tipo: 'gestor' },
      { nome: 'Cliente', email: 'cliente@rentcar.pt', password: seedPassword, tipo: 'cliente' },
    ];

    for (const userData of usersToCreate) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: { ...userData, password: hashedPassword }
      });

      if (!created) {
        await user.update({
          nome: userData.nome,
          password: hashedPassword,
          tipo: userData.tipo,
        });
        console.log(`User ${userData.email} updated successfully.`);
      } else {
        console.log(`User ${userData.email} created successfully.`);
      }
    }
  } catch (error) {
    console.error('Error seeding users:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
