const { Op } = require('sequelize');
const { Reservation, Vehicle, User, Unavailability } = require('../models');
const {
  normalizeDateRange,
  calculateDaysBetween,
  buildOverlapWhere,
} = require('../utils/dateHelpers');

async function createReservation(req, res, next) {
  try {
    const { userId, vehicleId, data_inicio, data_fim } = req.body;

    if (!userId || !vehicleId || !data_inicio || !data_fim) {
      return res.status(400).json({
        message: 'userId, vehicleId, data_inicio e data_fim sao obrigatorios.',
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilizador nao encontrado.' });
    }

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Veiculo nao encontrado.' });
    }

    if (vehicle.status !== 'Disponível') {
      return res.status(409).json({
        message: 'O veiculo esta inativo e nao pode ser reservado.',
      });
    }

    const { inicio, fim } = normalizeDateRange(data_inicio, data_fim);

    const overlappingReservation = await Reservation.findOne({
      where: {
        vehicleId,
        estado: { [Op.ne]: 'cancelada' },
        ...buildOverlapWhere(inicio, fim),
      },
    });

    if (overlappingReservation) {
      return res.status(409).json({
        message: 'Ja existe uma reserva que sobrepoe este intervalo.',
      });
    }

    const overlappingUnavailability = await Unavailability.findOne({
      where: {
        vehicleId,
        ...buildOverlapWhere(inicio, fim),
      },
    });

    if (overlappingUnavailability) {
      return res.status(409).json({
        message: 'O veiculo esta indisponivel neste intervalo.',
      });
    }

    const days = calculateDaysBetween(inicio, fim);
    const preco_estimado = Number(vehicle.pricePerDay) * days;

    const reservation = await Reservation.create({
      userId,
      vehicleId,
      data_inicio,
      data_fim,
      estado: 'pendente',
      preco_estimado,
    });

    return res.status(201).json(reservation);
  } catch (error) {
    return next(error);
  }
}

async function listReservations(req, res, next) {
  try {
    const reservations = await Reservation.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Vehicle, as: 'vehicle' },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json(reservations);
  } catch (error) {
    return next(error);
  }
}

async function updateReservationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ message: 'O campo estado e obrigatorio.' });
    }

    const allowedStates = ['pendente', 'confirmada', 'cancelada'];
    if (!allowedStates.includes(estado)) {
      return res.status(400).json({
        message: 'Estado invalido. Use pendente, confirmada ou cancelada.',
      });
    }

    const reservation = await Reservation.findByPk(id, {
      include: [{ model: Vehicle, as: 'vehicle' }],
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva nao encontrada.' });
    }

    if (estado === 'confirmada') {
      const { inicio, fim } = normalizeDateRange(
        reservation.data_inicio,
        reservation.data_fim
      );

      const conflictReservation = await Reservation.findOne({
        where: {
          id: { [Op.ne]: reservation.id },
          vehicleId: reservation.vehicleId,
          estado: { [Op.ne]: 'cancelada' },
          ...buildOverlapWhere(inicio, fim),
        },
      });

      if (conflictReservation) {
        return res.status(409).json({
          message: 'Nao foi possivel confirmar porque existe conflito de datas.',
        });
      }

      const conflictUnavailability = await Unavailability.findOne({
        where: {
          vehicleId: reservation.vehicleId,
          ...buildOverlapWhere(inicio, fim),
        },
      });

      if (conflictUnavailability) {
        return res.status(409).json({
          message: 'Nao foi possivel confirmar porque o veiculo esta indisponivel.',
        });
      }
    }

    reservation.estado = estado;
    await reservation.save();

    return res.json(reservation);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createReservation,
  listReservations,
  updateReservationStatus,
};