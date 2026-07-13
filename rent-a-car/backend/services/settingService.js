const { AppSetting } = require('../models');

async function getSetting(key, fallback) {
  const setting = await AppSetting.findByPk(key);
  return setting ? setting.value : fallback;
}

module.exports = { getSetting };
