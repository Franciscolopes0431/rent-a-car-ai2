const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Reservation, Vehicle, User, Unavailability } = require('../models');
const {
  normalizeDateRange,
  calculateDaysBetween,
  buildOverlapWhere,
} = require('../utils/dateHelpers');

function toReservationResponse(reservation) {
  if (!reservation) return null;

  const userName = reservation.user?.nome || '';
  const [firstName, ...lastNameParts] = userName.split(' ');

  return {
    id: reservation.id,
    reference: reservation.reference || `RES-${String(reservation.id).padStart(4, '0')}`,
    userId: reservation.userId,
    vehicleId: reservation.vehicleId,
    data_inicio: reservation.data_inicio,
    data_fim: reservation.data_fim,
    estado: reservation.estado,
    preco_estimado: reservation.preco_estimado,
    extras: reservation.extras || {},
    status: reservation.estado,
    startDate: reservation.data_inicio,
    endDate: reservation.data_fim,
    totalPrice: reservation.preco_estimado,
    createdAt: reservation.createdAt,
    updatedAt: reservation.updatedAt,
    user: reservation.user ? {
      id: reservation.user.id,
      name: reservation.user.nome,
      email: reservation.user.email,
      role: reservation.user.tipo,
    } : null,
    customer: reservation.user ? {
      id: reservation.user.id,
      firstName,
      lastName: lastNameParts.join(' '),
      email: reservation.user.email,
    } : null,
    vehicle: reservation.vehicle ? {
      id: reservation.vehicle.id,
      brand: reservation.vehicle.brand,
      model: reservation.vehicle.model,
      plate: reservation.vehicle.plate,
      category: reservation.vehicle.category,
      pricePerDay: reservation.vehicle.pricePerDay,
      status: reservation.vehicle.status,
    } : null,
  };
}

function isAdminOrGestor(user) {
  return user?.role === 'admin' || user?.role === 'gestor';
}

async function createReservation(req, res, next) {
  try {
    const { vehicleId, data_inicio, data_fim, estado, extras = {} } = req.body;

    if (!vehicleId || !data_inicio || !data_fim) {
      return res.status(400).json({
        message: 'vehicleId, data_inicio e data_fim sao obrigatorios.',
      });
    }

    const userId = isAdminOrGestor(req.user) ? req.body.userId || req.user.id : req.user.id;
    const initialStatus = isAdminOrGestor(req.user) && estado ? estado : 'pendente';
    if (!['pendente', 'confirmada'].includes(initialStatus)) {
      return res.status(400).json({ message: 'Uma nova reserva deve ficar pendente ou confirmada.' });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pickupDate = new Date(`${data_inicio}T00:00:00Z`);
    const returnDate = new Date(`${data_fim}T00:00:00Z`);

    if (pickupDate < today) {
      return res.status(400).json({ message: 'O levantamento nao pode ser anterior a data atual.' });
    }

    if (returnDate <= pickupDate) {
      return res.status(400).json({ message: 'A devolucao deve ser posterior ao levantamento.' });
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
    const safeExtras = { gps: extras.gps === true, insurance: extras.insurance === true, childSeat: Math.min(3, Math.max(0, Number(extras.childSeat) || 0)) };
    const extrasPerDay = (safeExtras.gps ? 10 : 0) + (safeExtras.insurance ? 25 : 0) + (safeExtras.childSeat * 5);
    const preco_estimado = (Number(vehicle.pricePerDay) + extrasPerDay) * days;

    const reservation = await Reservation.create({
      userId,
      vehicleId,
      data_inicio,
      data_fim,
      estado: initialStatus,
      extras: safeExtras,
      preco_estimado,
    });

    return res.status(201).json(toReservationResponse(reservation));
  } catch (error) {
    return next(error);
  }
}

async function listReservations(req, res, next) {
  try {
    const accessWhere = isAdminOrGestor(req.user) ? {} : { userId: req.user.id };
    const where = { ...accessWhere };
    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 10)));
    const { status, from, to, search, history } = req.query;

    if (history === 'true') {
      where[Op.or] = [
        { estado: 'cancelada' },
        { estado: 'confirmada', data_fim: { [Op.lt]: new Date().toISOString().slice(0, 10) } },
      ];
    } else if (status) where.estado = status;
    if (from) where.data_fim = { [Op.gte]: from };
    if (to) where.data_inicio = { [Op.lte]: to };
    if (search) {
      const term = `%${String(search).trim()}%`;
      const searchConditions = [
        { '$user.nome$': { [Op.iLike]: term } },
        { '$user.email$': { [Op.iLike]: term } },
        { '$vehicle.brand$': { [Op.iLike]: term } },
        { '$vehicle.model$': { [Op.iLike]: term } },
        { '$vehicle.plate$': { [Op.iLike]: term } },
      ];
      const numericId = Number(String(search).replace(/\D/g, ''));
      if (numericId) searchConditions.push({ id: numericId });
      if (where[Op.or]) where[Op.and] = [{ [Op.or]: where[Op.or] }, { [Op.or]: searchConditions }];
      else where[Op.or] = searchConditions;
    }

    const { rows, count } = await Reservation.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user' },
        { model: Vehicle, as: 'vehicle' },
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      distinct: true,
      subQuery: false,
    });

    const statusCounts = await Reservation.count({
      where: accessWhere,
      group: ['estado'],
    });
    const summary = { total: 0, pendente: 0, confirmada: 0, cancelada: 0 };
    statusCounts.forEach((entry) => {
      summary[entry.estado] = Number(entry.count);
      summary.total += Number(entry.count);
    });

    return res.json({
      data: rows.map(toReservationResponse),
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize),
      },
      summary,
    });
  } catch (error) {
    return next(error);
  }
}

async function getReservation(req, res, next) {
  try {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user' },
        { model: Vehicle, as: 'vehicle' },
      ],
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva nao encontrada.' });
    }

    if (!isAdminOrGestor(req.user) && reservation.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.json(toReservationResponse(reservation));
  } catch (error) {
    return next(error);
  }
}

async function updateReservation(req, res, next) {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva nao encontrada.' });
    }

    if (!isAdminOrGestor(req.user) && reservation.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { data_inicio, data_fim, vehicleId, estado, extras } = req.body;
    const nextVehicleId = vehicleId || reservation.vehicleId;
    const nextStart = data_inicio || reservation.data_inicio;
    const nextEnd = data_fim || reservation.data_fim;

    const { inicio, fim } = normalizeDateRange(nextStart, nextEnd);

    const vehicle = await Vehicle.findByPk(nextVehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Veiculo nao encontrado.' });
    }

    const overlappingReservation = await Reservation.findOne({
      where: {
        id: { [Op.ne]: reservation.id },
        vehicleId: nextVehicleId,
        estado: { [Op.ne]: 'cancelada' },
        ...buildOverlapWhere(inicio, fim),
      },
    });

    if (overlappingReservation) {
      return res.status(409).json({ message: 'Ja existe uma reserva que sobrepoe este intervalo.' });
    }

    const overlappingUnavailability = await Unavailability.findOne({
      where: {
        vehicleId: nextVehicleId,
        ...buildOverlapWhere(inicio, fim),
      },
    });

    if (overlappingUnavailability) {
      return res.status(409).json({ message: 'O veiculo esta indisponivel neste intervalo.' });
    }

    const days = calculateDaysBetween(inicio, fim);
    const nextExtras = extras || reservation.extras || {};
    const safeExtras = { gps: nextExtras.gps === true, insurance: nextExtras.insurance === true, childSeat: Math.min(3, Math.max(0, Number(nextExtras.childSeat) || 0)) };
    const extrasPerDay = (safeExtras.gps ? 10 : 0) + (safeExtras.insurance ? 25 : 0) + (safeExtras.childSeat * 5);
    const preco_estimado = (Number(vehicle.pricePerDay) + extrasPerDay) * days;

    if (estado !== undefined) {
      if (!isAdminOrGestor(req.user)) {
        return res.status(403).json({ message: 'Apenas administradores e gestores podem alterar o estado.' });
      }
      if (!['pendente', 'confirmada', 'cancelada'].includes(estado)) {
        return res.status(400).json({ message: 'Estado de reserva inválido.' });
      }
    }

    reservation.data_inicio = nextStart;
    reservation.data_fim = nextEnd;
    reservation.vehicleId = nextVehicleId;
    reservation.preco_estimado = preco_estimado;
    reservation.extras = safeExtras;
    if (estado !== undefined) reservation.estado = estado;
    await reservation.save();

    return res.json(toReservationResponse(reservation));
  } catch (error) {
    return next(error);
  }
}

async function listReservationCustomers(req, res, next) {
  try {
    const users = await User.findAll({
      where: { tipo: 'cliente' },
      attributes: ['id', 'nome', 'email'],
      order: [['nome', 'ASC']],
    });
    return res.json(users.map((user) => ({ id: user.id, name: user.nome, email: user.email })));
  } catch (error) {
    return next(error);
  }
}

async function createReservationCustomer(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e palavra-passe são obrigatórios.' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: 'A palavra-passe deve ter pelo menos 8 caracteres.' });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    if (await User.findOne({ where: { email: normalizedEmail } })) {
      return res.status(409).json({ message: 'Já existe uma conta com este email.' });
    }
    const user = await User.create({
      nome: String(name).trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(String(password), 10),
      tipo: 'cliente',
    });
    return res.status(201).json({ id: user.id, name: user.nome, email: user.email });
  } catch (error) {
    return next(error);
  }
}

async function cancelReservation(req, res, next) {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva nao encontrada.' });
    }

    if (!isAdminOrGestor(req.user) && reservation.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (reservation.estado === 'cancelada') {
      return res.status(409).json({ message: 'A reserva ja se encontra cancelada.' });
    }

    reservation.estado = 'cancelada';
    await reservation.save();

    return res.json(toReservationResponse(reservation));
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

    return res.json(toReservationResponse(reservation));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  toReservationResponse,
  createReservation,
  listReservations,
  getReservation,
  updateReservation,
  cancelReservation,
  updateReservationStatus,
  listReservationCustomers,
  createReservationCustomer,
};
