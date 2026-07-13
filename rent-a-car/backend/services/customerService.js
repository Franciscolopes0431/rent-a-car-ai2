const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User, Reservation, Vehicle } = require('../models');

function splitName(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return { firstName: parts.shift() || '', lastName: parts.join(' ') };
}

function toCustomer(user) {
  const { firstName, lastName } = splitName(user.nome);
  return {
    id: user.id,
    firstName,
    lastName,
    name: user.nome,
    email: user.email,
    phone: user.phone || '',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function list({ search, page = 1, pageSize = 10 }) {
  const where = { tipo: 'cliente' };
  if (search) {
    where[Op.or] = [
      { nome: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }
  const { rows, count } = await User.findAndCountAll({
    where,
    order: [['updatedAt', 'DESC']],
    limit: Number(pageSize),
    offset: (Number(page) - 1) * Number(pageSize),
  });
  return {
    data: rows.map(toCustomer),
    pagination: {
      page: Number(page), pageSize: Number(pageSize), total: count,
      totalPages: Math.ceil(count / Number(pageSize)),
    },
  };
}

async function findById(id) {
  const customer = await User.findOne({
    where: { id, tipo: 'cliente' },
    include: [{
      model: Reservation,
      as: 'reservations',
      include: [{ model: Vehicle, as: 'vehicle', attributes: ['brand', 'model', 'plate'] }],
    }],
  });
  if (!customer) {
    const error = new Error('Cliente não encontrado.');
    error.status = 404;
    throw error;
  }
  const totalSpent = await Reservation.sum('preco_estimado', {
    where: {
      userId: id,
      estado: 'concluida',
    },
  });
  return { ...toCustomer(customer), bookings: customer.reservations, totalSpent: Number(totalSpent || 0) };
}

async function create(payload) {
  const email = String(payload.email || '').trim().toLowerCase();
  if (await User.findOne({ where: { email } })) {
    const error = new Error('Já existe uma conta com este email.');
    error.status = 409;
    throw error;
  }
  if (!payload.password || String(payload.password).length < 8) {
    const error = new Error('Indique uma palavra-passe com pelo menos 8 caracteres.');
    error.status = 400;
    throw error;
  }
  const user = await User.create({
    nome: `${payload.firstName} ${payload.lastName}`.trim(),
    email,
    phone: payload.phone || null,
    password: await bcrypt.hash(String(payload.password), 10),
    tipo: 'cliente',
  });
  return toCustomer(user);
}

async function update(id, payload) {
  const customer = await User.findOne({ where: { id, tipo: 'cliente' } });
  if (!customer) {
    const error = new Error('Cliente não encontrado.');
    error.status = 404;
    throw error;
  }
  const currentName = splitName(customer.nome);
  const email = payload.email ? String(payload.email).trim().toLowerCase() : customer.email;
  const duplicate = await User.findOne({ where: { email, id: { [Op.ne]: customer.id } } });
  if (duplicate) {
    const error = new Error('Já existe uma conta com este email.');
    error.status = 409;
    throw error;
  }
  await customer.update({
    nome: `${payload.firstName || currentName.firstName} ${payload.lastName ?? currentName.lastName}`.trim(),
    email,
    phone: payload.phone ?? customer.phone,
    ...(payload.password ? { password: await bcrypt.hash(String(payload.password), 10) } : {}),
  });
  return toCustomer(customer);
}

async function remove(id) {
  const customer = await User.findOne({ where: { id, tipo: 'cliente' } });
  if (!customer) {
    const error = new Error('Cliente não encontrado.');
    error.status = 404;
    throw error;
  }
  const reservationCount = await Reservation.count({ where: { userId: id } });
  if (reservationCount > 0) {
    const error = new Error('Não é possível eliminar um cliente com reservas. Atualize os dados da conta em vez de remover o histórico.');
    error.status = 409;
    throw error;
  }
  await customer.destroy();
  return customer;
}

module.exports = { list, findById, create, update, remove, toCustomer };
