const { UniqueConstraintError } = require('sequelize');
const { Vehicle } = require('../models');

async function listVehicles(req, res, next) {
  try {
    const vehicles = await Vehicle.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(vehicles);
  } catch (error) {
    return next(error);
  }
}

async function createVehicle(req, res, next) {
  try {
    const { matricula, marca, modelo, preco_diario, estado } = req.body;

    if (!matricula || !marca || !modelo || preco_diario === undefined) {
      return res.status(400).json({
        message: 'matricula, marca, modelo e preco_diario sao obrigatorios.',
      });
    }

    const vehicle = await Vehicle.create({
      matricula,
      marca,
      modelo,
      preco_diario,
      estado: estado || 'ativo',
    });

    return res.status(201).json(vehicle);
  } catch (error) {
    if (error instanceof UniqueConstraintError || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        message: 'Ja existe um veiculo com essa matricula.',
      });
    }

    return next(error);
  }
}

module.exports = {
  listVehicles,
  createVehicle,
};