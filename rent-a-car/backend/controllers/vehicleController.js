const vehicleService = require('../services/vehicleService');
const { validateVehiclePayload } = require('../validators/vehicleValidator');

async function listVehicles(req, res, next) {
  try {
    const result = await vehicleService.list(req.query);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getVehicle(req, res, next) {
  try {
    const vehicle = await vehicleService.findById(req.params.id);
    return res.json(vehicle);
  } catch (error) {
    return next(error);
  }
}

async function createVehicle(req, res, next) {
  try {
    const errors = validateVehiclePayload(req.body);
    if (errors.length) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const vehicle = await vehicleService.create(req.body);
    return res.status(201).json(vehicle);
  } catch (error) {
    return next(error);
  }
}

async function updateVehicle(req, res, next) {
  try {
    const errors = validateVehiclePayload(req.body, true);
    if (errors.length) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const vehicle = await vehicleService.update(req.params.id, req.body);
    return res.json(vehicle);
  } catch (error) {
    return next(error);
  }
}

async function deleteVehicle(req, res, next) {
  try {
    await vehicleService.remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function changeVehicleStatus(req, res, next) {
  try {
    const { status } = req.body;
    const vehicle = await vehicleService.changeStatus(req.params.id, status);
    return res.json(vehicle);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  changeVehicleStatus,
};