const { Op } = require('sequelize');
const { Vehicle, Reservation, Unavailability } = require('../models');
const { normalizeDateRange, buildOverlapWhere } = require('../utils/dateHelpers');

async function createUnavailability(req, res, next) {
  try {
    const { vehicleId, data_inicio, data_fim, motivo } = req.body;

    if (!vehicleId || !data_inicio || !data_fim || !motivo) {
      return res.status(400).json({
        message: 'vehicleId, data_inicio, data_fim e motivo sao obrigatorios.',
      });
    }

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Veiculo nao encontrado.' });
    }

    const { inicio, fim } = normalizeDateRange(data_inicio, data_fim);

    const conflictReservation = await Reservation.findOne({
      where: {
        vehicleId,
        estado: { [Op.ne]: 'cancelada' },
        ...buildOverlapWhere(inicio, fim),
      },
    });

    if (conflictReservation) {
      return res.status(409).json({
        message: 'Nao e possivel criar indisponibilidade com reservas existentes.',
      });
    }

    const conflictUnavailability = await Unavailability.findOne({
      where: {
        vehicleId,
        ...buildOverlapWhere(inicio, fim),
      },
    });

    if (conflictUnavailability) {
      return res.status(409).json({
        message: 'Ja existe uma indisponibilidade nesse intervalo.',
      });
    }

    const unavailability = await Unavailability.create({
      vehicleId,
      data_inicio,
      data_fim,
      motivo,
    });

    return res.status(201).json(unavailability);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createUnavailability,
};