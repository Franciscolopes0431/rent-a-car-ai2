const service = require('../services/dashboardService');

exports.getStats = async (req, res, next) => {
  try {
    res.json(await service.getStats());
  } catch (error) {
    next(error);
  }
};

exports.getAlerts = async (req, res, next) => {
  try {
    res.json(await service.getAlerts());
  } catch (error) {
    next(error);
  }
};
