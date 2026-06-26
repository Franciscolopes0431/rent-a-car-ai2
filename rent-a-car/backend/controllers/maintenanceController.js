const maintenanceService = require('../services/maintenanceService');

async function listMaintenance(req, res, next) {
  try {
    const result = await maintenanceService.list(req.query);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getMaintenance(req, res, next) {
  try {
    const alert = await maintenanceService.findById(req.params.id);
    return res.json(alert);
  } catch (error) {
    return next(error);
  }
}

async function createMaintenance(req, res, next) {
  try {
    const alert = await maintenanceService.create(req.body);
    return res.status(201).json(alert);
  } catch (error) {
    return next(error);
  }
}

async function updateMaintenance(req, res, next) {
  try {
    const alert = await maintenanceService.update(req.params.id, req.body);
    return res.json(alert);
  } catch (error) {
    return next(error);
  }
}

async function resolveMaintenance(req, res, next) {
  try {
    const alert = await maintenanceService.resolve(req.params.id);
    return res.json(alert);
  } catch (error) {
    return next(error);
  }
}

async function deleteMaintenance(req, res, next) {
  try {
    await maintenanceService.remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listMaintenance,
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  resolveMaintenance,
  deleteMaintenance,
};