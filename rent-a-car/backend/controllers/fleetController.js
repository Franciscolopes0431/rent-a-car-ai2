const service = require('../services/fleetService');

exports.getStatus = async (req, res, next) => {
  try {
    res.json(await service.getStatus());
  } catch (error) {
    next(error);
  }
};
