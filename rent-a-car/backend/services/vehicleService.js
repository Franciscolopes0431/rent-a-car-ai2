const { Op } = require('sequelize');
const { Vehicle, Reservation, User } = require('../models');
const { normalizePagination } = require('../utils/pagination');

async function list({ status, category, search, page = 1, pageSize = 10 }) {
  const pagination = normalizePagination(page, pageSize);
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
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return {
    data: rows,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: count,
      totalPages: Math.ceil(count / pagination.pageSize),
    },
  };
}

async function findPublicById(id) {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) {
    const error = new Error('Viatura não encontrada');
    error.status = 404;
    throw error;
  }
  return vehicle;
}

async function findManagedById(id) {
  const vehicle = await Vehicle.findByPk(id, {
    include: [
      {
        model: Reservation,
        as: 'reservations',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nome', 'email'],
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

  const result = vehicle.toJSON();
  result.bookings = (result.reservations || []).map((reservation) => ({
    ...reservation,
    status: reservation.estado,
    startDate: reservation.data_inicio,
    endDate: reservation.data_fim,
    totalPrice: reservation.preco_estimado,
    customer: reservation.user ? {
      id: reservation.user.id,
      firstName: reservation.user.nome.split(' ')[0],
      lastName: reservation.user.nome.split(' ').slice(1).join(' '),
      email: reservation.user.email,
    } : null,
  }));
  return result;
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

  const reservationCount = await Reservation.count({ where: { vehicleId: id } });
  if (reservationCount > 0) {
    const error = new Error('Não é possível eliminar uma viatura com reservas. Coloque-a em manutenção para preservar o histórico.');
    error.status = 409;
    throw error;
  }

  await vehicle.destroy();
  return vehicle;
}

async function changeStatus(id, status) {
  const allowedStatuses = ['Disponível', 'Reservado', 'Manutenção'];
  if (!allowedStatuses.includes(status)) {
    const error = new Error('Estado da viatura inválido.');
    error.status = 400;
    throw error;
  }
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
  findPublicById,
  findManagedById,
  create,
  update,
  remove,
  changeStatus,
};
