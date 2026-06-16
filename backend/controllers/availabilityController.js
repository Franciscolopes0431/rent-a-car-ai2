const { Op } = require('sequelize');
const { Vehicle, Reservation, Unavailability } = require('../models');
const { normalizeDateRange, buildOverlapWhere } = require('../utils/dateHelpers');

async function getAvailableVehicles(req, res, next) {
  try {
    const { data_inicio, data_fim } = req.query;

    if (!data_inicio || !data_fim) {
      return res.status(400).json({
        message: 'Os parametros data_inicio e data_fim sao obrigatorios.',
      });
    }

    const { inicio, fim } = normalizeDateRange(data_inicio, data_fim);

    const availableVehicles = await Vehicle.findAll({
      where: {
        estado: 'ativo',
      },
    });

    if (availableVehicles.length === 0) {
      return res.json([]);
    }

    const vehicleIds = availableVehicles.map((vehicle) => vehicle.id);

    // Bloqueia veiculos com reservas ativas ou manutencoes que intersectem o intervalo pedido.
    const overlappingReservations = await Reservation.findAll({
      where: {
        vehicleId: { [Op.in]: vehicleIds },
        estado: { [Op.ne]: 'cancelada' },
        ...buildOverlapWhere(inicio, fim),
      },
      attributes: ['vehicleId'],
    });

    const overlappingUnavailabilities = await Unavailability.findAll({
      where: {
        vehicleId: { [Op.in]: vehicleIds },
        ...buildOverlapWhere(inicio, fim),
      },
      attributes: ['vehicleId'],
    });

    const blockedVehicleIds = new Set([
      ...overlappingReservations.map((item) => item.vehicleId),
      ...overlappingUnavailabilities.map((item) => item.vehicleId),
    ]);

    const filteredVehicles = availableVehicles.filter(
      (vehicle) => !blockedVehicleIds.has(vehicle.id)
    );

    return res.json(filteredVehicles);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAvailableVehicles,
};