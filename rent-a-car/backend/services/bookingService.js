const { Op } = require('sequelize');
const { Booking, Vehicle, Customer } = require('../models');

function normalizeDate(value) {
  return value ? new Date(value) : null;
}

async function list({ status, customerId, vehicleId, from, to, search, page = 1, pageSize = 10 }) {
  const where = {};
  const includes = [
    { model: Customer, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'email'] },
    { model: Vehicle, as: 'vehicle', attributes: ['id', 'brand', 'model', 'plate', 'category'] },
  ];

  if (status) where.status = status;
  if (customerId) where.customerId = customerId;
  if (vehicleId) where.vehicleId = vehicleId;
  if (from || to) {
    where[Op.and] = [];
    if (from) where[Op.and].push({ startDate: { [Op.gte]: from } });
    if (to) where[Op.and].push({ startDate: { [Op.lte]: to } });
  }

  if (search) {
    where[Op.or] = [
      { reference: { [Op.iLike]: `%${search}%` } },
      { '$customer.first_name$': { [Op.iLike]: `%${search}%` } },
      { '$customer.last_name$': { [Op.iLike]: `%${search}%` } },
      { '$vehicle.brand$': { [Op.iLike]: `%${search}%` } },
      { '$vehicle.model$': { [Op.iLike]: `%${search}%` } },
      { '$vehicle.plate$': { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await Booking.findAndCountAll({
    where,
    include: includes,
    order: [['createdAt', 'DESC']],
    limit: Number(pageSize),
    offset: (Number(page) - 1) * Number(pageSize),
    distinct: true,
  });

  return {
    data: rows,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total: count,
      totalPages: Math.ceil(count / pageSize),
    },
  };
}

async function findById(id) {
  const booking = await Booking.findByPk(id, {
    include: [
      { model: Customer, as: 'customer' },
      { model: Vehicle, as: 'vehicle' },
    ],
  });

  if (!booking) {
    const error = new Error('Reserva não encontrada');
    error.status = 404;
    throw error;
  }

  return booking;
}

async function checkAvailability(vehicleId, startDate, endDate, excludeId = null) {
  const where = {
    vehicleId,
    status: { [Op.in]: ['Pendente', 'Confirmada', 'Em curso'] },
    [Op.and]: [
      { startDate: { [Op.lte]: endDate } },
      { endDate: { [Op.gte]: startDate } },
    ],
  };

  if (excludeId) {
    where.id = { [Op.ne]: excludeId };
  }

  const conflict = await Booking.findOne({ where });
  if (conflict) {
    const error = new Error('Veículo já reservado nesse intervalo de datas');
    error.status = 409;
    throw error;
  }
}

async function generateReference() {
  const lastId = await Booking.max('id');
  const nextId = (Number(lastId) || 0) + 1;
  return `RES-${String(nextId).padStart(4, '0')}`;
}

function calculateDays(startDate, endDate) {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diff);
}

async function calculateTotal(vehicleId, startDate, endDate) {
  const vehicle = await Vehicle.findByPk(vehicleId);
  if (!vehicle) {
    const error = new Error('Veículo não encontrado');
    error.status = 404;
    throw error;
  }

  const days = calculateDays(startDate, endDate);
  return Number(vehicle.pricePerDay) * days;
}

async function create(payload) {
  await checkAvailability(payload.vehicleId, payload.startDate, payload.endDate);
  const reference = await generateReference();
  const totalPrice = await calculateTotal(payload.vehicleId, payload.startDate, payload.endDate);

  return Booking.create({ ...payload, reference, totalPrice });
}

async function update(id, payload) {
  const booking = await Booking.findByPk(id);
  if (!booking) {
    const error = new Error('Reserva não encontrada');
    error.status = 404;
    throw error;
  }

  const startDate = payload.startDate || booking.startDate;
  const endDate = payload.endDate || booking.endDate;
  const vehicleId = payload.vehicleId || booking.vehicleId;

  await checkAvailability(vehicleId, startDate, endDate, id);

  if (payload.startDate || payload.endDate || payload.vehicleId) {
    payload.totalPrice = await calculateTotal(vehicleId, startDate, endDate);
  }

  return booking.update(payload);
}

async function changeStatus(id, status) {
  const booking = await Booking.findByPk(id);
  if (!booking) {
    const error = new Error('Reserva não encontrada');
    error.status = 404;
    throw error;
  }

  return booking.update({ status });
}

async function cancel(id) {
  const booking = await Booking.findByPk(id);
  if (!booking) {
    const error = new Error('Reserva não encontrada');
    error.status = 404;
    throw error;
  }

  return booking.update({ status: 'Cancelada' });
}

module.exports = {
  list,
  findById,
  create,
  update,
  changeStatus,
  cancel,
  checkAvailability,
  calculateTotal,
};
