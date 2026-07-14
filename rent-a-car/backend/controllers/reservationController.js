const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Reservation, Vehicle, User, Unavailability, sequelize } = require('../models');
const {
  normalizeDateRange,
  calculateDaysBetween,
  buildOverlapWhere,
} = require('../utils/dateHelpers');
const { notify } = require('../services/notificationService');
const { getSetting } = require('../services/settingService');
const { blockingReservationWhere, PENDING_TIMEOUT_MINUTES } = require('../services/reservationLifecycleService');
const { isStrongPassword, PASSWORD_MESSAGE } = require('../utils/passwordPolicy');

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function toReservationResponse(reservation) {
  if (!reservation) return null;

  const userName = reservation.user?.nome || '';
  const [firstName, ...lastNameParts] = userName.split(' ');

  const lifecycleStatus = reservation.estado === 'concluida' ? 'concluída' : reservation.estado;
  return {
    id: reservation.id,
    reference: reservation.reference || `RES-${String(reservation.id).padStart(4, '0')}`,
    userId: reservation.userId,
    vehicleId: reservation.vehicleId,
    data_inicio: reservation.data_inicio,
    data_fim: reservation.data_fim,
    estado: reservation.estado,
    lifecycleStatus,
    preco_estimado: reservation.preco_estimado,
    extras: reservation.extras || {},
    pickupLocation: reservation.pickupLocation || null,
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
    const { vehicleId, data_inicio, data_fim, estado, extras = {}, pickupLocation } = req.body;

    if (!vehicleId || !data_inicio || !data_fim) {
      return res.status(400).json({
        message: 'vehicleId, data_inicio e data_fim sao obrigatorios.',
      });
    }

    if (isAdminOrGestor(req.user) && !req.body.userId) {
      return res.status(400).json({ message: 'Selecione o cliente da reserva.' });
    }
    const userId = isAdminOrGestor(req.user) ? req.body.userId : req.user.id;
    const initialStatus = isAdminOrGestor(req.user) && estado ? estado : 'pendente';
    if (!['pendente', 'confirmada'].includes(initialStatus)) {
      return res.status(400).json({ message: 'Uma nova reserva deve ficar pendente ou confirmada.' });
    }
    const today = new Date().toISOString().slice(0, 10);
    if (String(data_inicio).slice(0, 10) < today) {
      return res.status(400).json({ message: 'O levantamento nao pode ser anterior a data atual.' });
    }

    const user = await User.findByPk(userId);
    if (!user || user.tipo !== 'cliente') {
      return res.status(404).json({ message: 'Utilizador nao encontrado.' });
    }

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Veiculo nao encontrado.' });
    }

    if (vehicle.status === 'Manutenção') {
      return res.status(409).json({
        message: 'O veiculo esta inativo e nao pode ser reservado.',
      });
    }

    const { inicio, fim } = normalizeDateRange(data_inicio, data_fim);
    const days = calculateDaysBetween(inicio, fim);
    const maxRentalDays = Math.max(1, Number(process.env.MAX_RENTAL_DAYS || 30));
    if (days > maxRentalDays) {
      return res.status(400).json({ message: `Uma reserva não pode exceder ${maxRentalDays} dias.` });
    }
    const transaction = await sequelize.transaction();
    try {
      await sequelize.query('SELECT pg_advisory_xact_lock(:userLock)', {
        replacements: { userLock: -Number(userId) },
        transaction,
      });
      await sequelize.query('SELECT pg_advisory_xact_lock(:vehicleId)', {
        replacements: { vehicleId: Number(vehicleId) },
        transaction,
      });

    if (!isAdminOrGestor(req.user)) {
      const pendingCount = await Reservation.count({
        where: {
          userId,
          estado: 'pendente',
          createdAt: { [Op.gte]: new Date(Date.now() - PENDING_TIMEOUT_MINUTES * 60 * 1000) },
        },
        transaction,
      });
      if (pendingCount >= 3) {
        await transaction.rollback();
        return res.status(429).json({ message: 'Tem demasiadas reservas pendentes. Confirme ou cancele uma antes de continuar.' });
      }
    }

    const overlappingReservation = await Reservation.findOne({
      where: {
        vehicleId,
        ...blockingReservationWhere(inicio, fim),
      },
      transaction,
    });

    if (overlappingReservation) {
      await transaction.rollback();
      return res.status(409).json({
        message: 'Ja existe uma reserva que sobrepoe este intervalo.',
      });
    }

    const overlappingUnavailability = await Unavailability.findOne({
      where: {
        vehicleId,
        ...buildOverlapWhere(inicio, fim),
      },
      transaction,
    });

    if (overlappingUnavailability) {
      await transaction.rollback();
      return res.status(409).json({
        message: 'O veiculo esta indisponivel neste intervalo.',
      });
    }

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
      pickupLocation: pickupLocation ? String(pickupLocation).trim().slice(0, 160) : null,
      preco_estimado,
    }, { transaction });

    await transaction.commit();

    await notify({ userId, type: 'reserva_criada', title: 'Reserva criada', message: `A reserva ${reservation.reference || `#${reservation.id}`} foi criada.`, link: '/cliente/minhas-reservas' });

    return res.status(201).json(toReservationResponse(reservation));
    } catch (transactionError) {
      if (!transaction.finished) await transaction.rollback();
      throw transactionError;
    }
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
        { estado: 'concluida' },
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
    const summary = { total: 0, pendente: 0, confirmada: 0, concluida: 0, cancelada: 0 };
    statusCounts.forEach((entry) => {
      summary[entry.estado] = Number(entry.count);
      summary.total += Number(entry.count);
    });

    if (!isAdminOrGestor(req.user)) {
      const today = new Date().toISOString().slice(0, 10);
      const completed = await Reservation.findAll({
        where: { ...accessWhere, estado: 'concluida' },
        attributes: ['data_inicio', 'data_fim', 'preco_estimado'],
      });
      summary.finished = completed.length;
      summary.rentalDays = completed.reduce((total, item) => {
        const start = new Date(`${item.data_inicio}T00:00:00Z`);
        const end = new Date(`${item.data_fim}T00:00:00Z`);
        return total + Math.max(1, Math.ceil((end - start) / 86400000));
      }, 0);
      summary.spent = completed.reduce((total, item) => total + Number(item.preco_estimado || 0), 0);
      summary.active = await Reservation.count({
        where: { ...accessWhere, estado: { [Op.ne]: 'cancelada' }, data_fim: { [Op.gte]: today } },
      });
    }

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

    if (!reservation) throw httpError(404, 'Reserva nao encontrada.');

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
    const reservation = await sequelize.transaction(async (transaction) => {
      const current = await Reservation.findByPk(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!current) throw httpError(404, 'Reserva não encontrada.');
      if (!isAdminOrGestor(req.user) && current.userId !== req.user.id) throw httpError(403, 'Sem acesso a esta reserva.');

      const { data_inicio, data_fim, vehicleId, estado, extras, pickupLocation } = req.body;
      const nextVehicleId = Number(vehicleId || current.vehicleId);
      const nextStart = data_inicio || current.data_inicio;
      const nextEnd = data_fim || current.data_fim;
      const today = new Date().toISOString().slice(0, 10);
      if (!isAdminOrGestor(req.user) && (current.estado !== 'pendente' || current.data_inicio <= today || nextStart < today)) {
        throw httpError(409, 'Já não é possível alterar esta reserva.');
      }
      if (estado !== undefined && (!isAdminOrGestor(req.user) || !['pendente', 'confirmada', 'concluida', 'cancelada'].includes(estado))) {
        throw httpError(isAdminOrGestor(req.user) ? 400 : 403, 'Estado de reserva inválido.');
      }
      if (estado !== undefined && ['cancelada', 'concluida'].includes(current.estado) && estado !== current.estado) {
        throw httpError(409, 'Uma reserva cancelada ou concluída tem um estado definitivo.');
      }
      if (current.estado === 'confirmada' && estado === 'pendente') throw httpError(409, 'Uma reserva confirmada não pode voltar ao estado pendente.');
      if (estado === 'concluida' && nextEnd > today) throw httpError(409, 'A reserva só pode ser concluída depois da data de devolução.');

      const { inicio, fim } = normalizeDateRange(nextStart, nextEnd);
      const lockIds = [...new Set([Number(current.vehicleId), nextVehicleId])].sort((a, b) => a - b);
      for (const vehicleLockId of lockIds) await sequelize.query('SELECT pg_advisory_xact_lock(:vehicleId)', { replacements: { vehicleId: vehicleLockId }, transaction });
      const vehicle = await Vehicle.findByPk(nextVehicleId, { transaction });
      if (!vehicle) throw httpError(404, 'Veículo não encontrado.');
      const maxRentalDays = Math.max(1, Number(process.env.MAX_RENTAL_DAYS || 30));
      if (calculateDaysBetween(inicio, fim) > maxRentalDays) throw httpError(400, `Uma reserva não pode exceder ${maxRentalDays} dias.`);
      const conflict = await Reservation.findOne({ where: { id: { [Op.ne]: current.id }, vehicleId: nextVehicleId, ...blockingReservationWhere(inicio, fim) }, transaction });
      if (conflict) throw httpError(409, 'Já existe uma reserva que sobrepõe este intervalo.');
      const unavailable = await Unavailability.findOne({ where: { vehicleId: nextVehicleId, ...buildOverlapWhere(inicio, fim) }, transaction });
      if (unavailable) throw httpError(409, 'O veículo está indisponível neste intervalo.');

      const nextExtras = extras || current.extras || {};
      const safeExtras = { gps: nextExtras.gps === true, insurance: nextExtras.insurance === true, childSeat: Math.min(3, Math.max(0, Number(nextExtras.childSeat) || 0)) };
      const extrasPerDay = (safeExtras.gps ? 10 : 0) + (safeExtras.insurance ? 25 : 0) + (safeExtras.childSeat * 5);
      Object.assign(current, { data_inicio: nextStart, data_fim: nextEnd, vehicleId: nextVehicleId, preco_estimado: (Number(vehicle.pricePerDay) + extrasPerDay) * calculateDaysBetween(inicio, fim), extras: safeExtras });
      if (pickupLocation !== undefined) current.pickupLocation = String(pickupLocation).trim().slice(0, 160) || null;
      if (estado !== undefined) current.estado = estado;
      await current.save({ transaction });
      return current;
    });
    await notify({ userId: reservation.userId, type: 'reserva_alterada', title: 'Reserva alterada', message: `A reserva ${reservation.reference || `#${reservation.id}`} foi atualizada.`, link: '/cliente/minhas-reservas' });
    const refreshed = await Reservation.findByPk(reservation.id, {
      include: [{ model: User, as: 'user' }, { model: Vehicle, as: 'vehicle' }],
    });
    return res.json(toReservationResponse(refreshed));
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
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: PASSWORD_MESSAGE });
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
    const cancellationHours = Number(await getSetting('cancellationHours', 48));
    const reservation = await sequelize.transaction(async (transaction) => {
      const current = await Reservation.findByPk(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!current) throw httpError(404, 'Reserva nao encontrada.');
      if (!isAdminOrGestor(req.user) && current.userId !== req.user.id) throw httpError(403, 'Sem acesso a esta reserva.');
      if (current.estado === 'cancelada') throw httpError(409, 'A reserva ja se encontra cancelada.');

      if (!isAdminOrGestor(req.user)) {
        const cutoff = new Date();
        cutoff.setHours(cutoff.getHours() + cancellationHours);
        const pickupDate = new Date(`${current.data_inicio}T00:00:00`);
        if (pickupDate < cutoff) throw httpError(409, `O cancelamento deve ser feito com pelo menos ${cancellationHours} horas de antecedência.`);
      }

      current.estado = 'cancelada';
      await current.save({ transaction });
      return current;
    });

    await notify({ userId: reservation.userId, type: 'reserva_cancelada', title: 'Reserva cancelada', message: `A reserva ${reservation.reference || `#${reservation.id}`} foi cancelada.`, link: '/cliente/historico' });

    const refreshed = await Reservation.findByPk(reservation.id, {
      include: [{ model: User, as: 'user' }, { model: Vehicle, as: 'vehicle' }],
    });
    return res.json(toReservationResponse(refreshed));
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

    const allowedStates = ['pendente', 'confirmada', 'concluida', 'cancelada'];
    if (!allowedStates.includes(estado)) {
      return res.status(400).json({
        message: 'Estado inválido. Use pendente, confirmada, concluida ou cancelada.',
      });
    }

    const transaction = await sequelize.transaction();
    let reservation;
    try {
      reservation = await Reservation.findByPk(id, {
        include: [{ model: Vehicle, as: 'vehicle' }],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

    if (!reservation) throw httpError(404, 'Reserva nao encontrada.');

    if (['cancelada', 'concluida'].includes(reservation.estado) && estado !== reservation.estado) {
      throw httpError(409, 'Uma reserva cancelada ou concluída tem um estado definitivo.');
    }
    if (reservation.estado === 'confirmada' && estado === 'pendente') {
      throw httpError(409, 'Uma reserva confirmada não pode voltar ao estado pendente.');
    }
    if (estado === 'concluida' && reservation.data_fim > new Date().toISOString().slice(0, 10)) {
      throw httpError(409, 'A reserva só pode ser concluída depois da data de devolução.');
    }

    if (estado === 'confirmada') {
      if (reservation.estado === 'pendente' && reservation.createdAt < new Date(Date.now() - PENDING_TIMEOUT_MINUTES * 60 * 1000)) {
        throw httpError(409, 'Esta reserva pendente já expirou e não pode ser confirmada.');
      }
      const { inicio, fim } = normalizeDateRange(
        reservation.data_inicio,
        reservation.data_fim
      );

      await sequelize.query('SELECT pg_advisory_xact_lock(:vehicleId)', { replacements: { vehicleId: Number(reservation.vehicleId) }, transaction });
      const conflictReservation = await Reservation.findOne({
        where: {
          id: { [Op.ne]: reservation.id },
          vehicleId: reservation.vehicleId,
          ...blockingReservationWhere(inicio, fim),
        },
        transaction,
      });

      if (conflictReservation) throw httpError(409, 'Nao foi possivel confirmar porque existe conflito de datas.');

      const conflictUnavailability = await Unavailability.findOne({
        where: {
          vehicleId: reservation.vehicleId,
          ...buildOverlapWhere(inicio, fim),
        }, transaction,
      });

      if (conflictUnavailability) throw httpError(409, 'Nao foi possivel confirmar porque o veiculo esta indisponivel.');
    }

    reservation.estado = estado;
    await reservation.save({ transaction });
    await transaction.commit();
    } catch (transactionError) {
      if (!transaction.finished) await transaction.rollback();
      throw transactionError;
    }

    await notify({ userId: reservation.userId, type: 'estado_reserva', title: 'Estado da reserva atualizado', message: `A reserva ${reservation.reference || `#${reservation.id}`} está agora ${estado === 'concluida' ? 'concluída' : estado}.`, link: estado === 'concluida' || estado === 'cancelada' ? '/cliente/historico' : '/cliente/minhas-reservas' });

    const refreshed = await Reservation.findByPk(reservation.id, {
      include: [{ model: User, as: 'user' }, { model: Vehicle, as: 'vehicle' }],
    });
    return res.json(toReservationResponse(refreshed));
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
