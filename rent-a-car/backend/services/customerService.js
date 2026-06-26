const { Op } = require('sequelize');
const { Customer, Booking, Vehicle } = require('../models');

async function list({ search, page = 1, pageSize = 10 }) {
  const where = {};

  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await Customer.findAndCountAll({
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
  const customer = await Customer.findByPk(id, {
    include: [
      {
        model: Booking,
        as: 'bookings',
        include: [{ model: Vehicle, as: 'vehicle', attributes: ['brand', 'model', 'plate'] }],
      },
    ],
  });

  if (!customer) {
    const error = new Error('Cliente não encontrado');
    error.status = 404;
    throw error;
  }

  const totalSpent = await Booking.sum('totalPrice', {
    where: {
      customerId: id,
      status: { [Op.in]: ['Confirmada', 'Em curso', 'Concluída'] },
    },
  });

  return {
    ...customer.toJSON(),
    totalSpent: Number(totalSpent || 0),
  };
}

async function create(payload) {
  return Customer.create(payload);
}

async function update(id, payload) {
  const customer = await Customer.findByPk(id);
  if (!customer) {
    const error = new Error('Cliente não encontrado');
    error.status = 404;
    throw error;
  }

  return customer.update(payload);
}

async function remove(id) {
  const customer = await Customer.findByPk(id);
  if (!customer) {
    const error = new Error('Cliente não encontrado');
    error.status = 404;
    throw error;
  }

  await customer.destroy();
  return customer;
}

module.exports = {
  list,
  findById,
  create,
  update,
  remove,
};