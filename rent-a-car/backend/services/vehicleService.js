const { Op } = require('sequelize');
const { Vehicle, Booking, Customer } = require('../models');

async function list({ status, category, search, page = 1, pageSize = 10 }) {
  const where = {};

  if (status) where.status = status;
  if (category) where.category = category;
  if (search) {
    where[Op.or] = [
      { brand: { [Op.iLike]: `%${search}%` } },
      { model: { [Op.iLike]: `%${search}%` } },
      { plate: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await Vehicle.findAndCountAll({
    where,
    order: [['updatedAt', 'DESC']],
    limit: Number(pageSize),
    offset: (Number(page) - 1) * Number(pageSize),
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
  const vehicle = await Vehicle.findByPk(id, {
    include: [
      {
        model: Booking,
        as: 'bookings',
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
      },
    ],
  });

  if (!vehicle) {
    const error = new Error('Viatura não encontrada');
    error.status = 404;
    throw error;
  }

  return vehicle;
}

async function create(payload) {
  return Vehicle.create(payload);
}

async function update(id, payload) {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) {
    const error = new Error('Viatura não encontrada');
    error.status = 404;
    throw error;
  }

  return vehicle.update(payload);
}

async function remove(id) {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) {
    const error = new Error('Viatura não encontrada');
    error.status = 404;
    throw error;
  }

  await vehicle.destroy();
  return vehicle;
}

async function changeStatus(id, status) {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) {
    const error = new Error('Viatura não encontrada');
    error.status = 404;
    throw error;
  }

  return vehicle.update({ status });
}

module.exports = {
  list,
  findById,
  create,
  update,
  remove,
  changeStatus,
};