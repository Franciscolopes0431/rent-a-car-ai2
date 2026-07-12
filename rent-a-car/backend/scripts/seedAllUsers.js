const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const usersToCreate = [
      { nome: 'Administrador', email: 'admin@rentcar.pt', password: 'password123', tipo: 'admin' },
      { nome: 'Gestor', email: 'gestor@rentcar.pt', password: 'password123', tipo: 'gestor' },
      { nome: 'Cliente', email: 'cliente@rentcar.pt', password: 'password123', tipo: 'cliente' }
    ];

    for (const userData of usersToCreate) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: { ...userData, password: hashedPassword }
      });

      if (!created) {
        await user.update({ ...userData, password: hashedPassword });
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
