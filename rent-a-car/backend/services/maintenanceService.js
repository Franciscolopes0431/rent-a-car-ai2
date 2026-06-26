const { MaintenanceAlert, Vehicle } = require('../models');

async function list({ resolved, vehicleId, type, page = 1, pageSize = 10 }) {
  const where = {};
  if (resolved !== undefined) {
    where.resolved = resolved === 'true' || resolved === true;
  }
  if (vehicleId) where.vehicleId = vehicleId;
  if (type) where.type = type;

  const { rows, count } = await MaintenanceAlert.findAndCountAll({
    where,
    include: [{ model: Vehicle, as: 'vehicle', attributes: ['brand', 'model', 'plate', 'status'] }],
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
  const alert = await MaintenanceAlert.findByPk(id, {
    include: [{ model: Vehicle, as: 'vehicle' }],
  });

  if (!alert) {
    const error = new Error('Alerta de manutenção não encontrado');
    error.status = 404;
    throw error;
  }

  return alert;
}

async function create(payload) {
  const transaction = await MaintenanceAlert.sequelize.transaction();

  try {
    const alert = await MaintenanceAlert.create(payload, { transaction });
    await Vehicle.update(
      { status: 'Manutenção' },
      { where: { id: payload.vehicleId }, transaction }
    );
    await transaction.commit();
    return alert;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function update(id, payload) {
  const alert = await MaintenanceAlert.findByPk(id);
  if (!alert) {
    const error = new Error('Alerta de manutenção não encontrado');
    error.status = 404;
    throw error;
  }

  return alert.update(payload);
}

async function resolve(id) {
  const transaction = await MaintenanceAlert.sequelize.transaction();

  try {
    const alert = await MaintenanceAlert.findByPk(id, { transaction });
    if (!alert) {
      const error = new Error('Alerta de manutenção não encontrado');
      error.status = 404;
      throw error;
    }

    await alert.update({ resolved: true }, { transaction });
    await Vehicle.update(
      { status: 'Disponível' },
      { where: { id: alert.vehicleId }, transaction }
    );

    await transaction.commit();
    return alert;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function remove(id) {
  const alert = await MaintenanceAlert.findByPk(id);
  if (!alert) {
    const error = new Error('Alerta de manutenção não encontrado');
    error.status = 404;
    throw error;
  }

  await alert.destroy();
  return alert;
}

module.exports = {
  list,
  findById,
  create,
  update,
  resolve,
  remove,
};