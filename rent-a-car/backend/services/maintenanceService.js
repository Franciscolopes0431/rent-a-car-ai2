const { Op } = require('sequelize');
const { MaintenanceAlert, Vehicle, Reservation } = require('../models');
const { normalizePagination } = require('../utils/pagination');

async function syncVehicleStatus(vehicleId, transaction) {
  const pending = await MaintenanceAlert.count({ where: { vehicleId, resolved: false }, transaction });
  const today = new Date().toISOString().slice(0, 10);
  const activeReservation = pending ? null : await Reservation.findOne({
    where: {
      vehicleId,
      estado: 'confirmada',
      data_inicio: { [Op.lte]: today },
      data_fim: { [Op.gt]: today },
    },
    transaction,
  });
  await Vehicle.update(
    { status: pending > 0 ? 'Manutenção' : activeReservation ? 'Reservado' : 'Disponível' },
    { where: { id: vehicleId }, transaction }
  );
}

async function list({ resolved, vehicleId, type, page = 1, pageSize = 10 }) {
  const pagination = normalizePagination(page, pageSize);
  const where = {};
  if (resolved !== undefined && resolved !== '') where.resolved = resolved === 'true' || resolved === true;
  if (vehicleId) where.vehicleId = vehicleId;
  if (type) where.type = type;
  const { rows, count } = await MaintenanceAlert.findAndCountAll({
    where,
    include: [{ model: Vehicle, as: 'vehicle', attributes: ['brand', 'model', 'plate', 'status'] }],
    order: [['createdAt', 'DESC']], limit: pagination.limit, offset: pagination.offset, distinct: true,
  });
  return { data: rows, pagination: { page: pagination.page, pageSize: pagination.pageSize, total: count, totalPages: Math.ceil(count / pagination.pageSize) } };
}

async function findById(id) {
  const alert = await MaintenanceAlert.findByPk(id, { include: [{ model: Vehicle, as: 'vehicle' }] });
  if (!alert) { const error = new Error('Alerta de manutenção não encontrado.'); error.status = 404; throw error; }
  return alert;
}

async function create(payload) {
  return MaintenanceAlert.sequelize.transaction(async (transaction) => {
    const vehicle = await Vehicle.findByPk(payload.vehicleId, { transaction });
    if (!vehicle) { const error = new Error('Viatura não encontrada.'); error.status = 404; throw error; }
    const alert = await MaintenanceAlert.create(payload, { transaction });
    await syncVehicleStatus(payload.vehicleId, transaction);
    return alert;
  });
}

async function update(id, payload) {
  return MaintenanceAlert.sequelize.transaction(async (transaction) => {
    const alert = await MaintenanceAlert.findByPk(id, { transaction });
    if (!alert) { const error = new Error('Alerta de manutenção não encontrado.'); error.status = 404; throw error; }
    const previousVehicleId = alert.vehicleId;
    await alert.update(payload, { transaction });
    await syncVehicleStatus(previousVehicleId, transaction);
    if (alert.vehicleId !== previousVehicleId) await syncVehicleStatus(alert.vehicleId, transaction);
    return alert;
  });
}

async function resolve(id) {
  return MaintenanceAlert.sequelize.transaction(async (transaction) => {
    const alert = await MaintenanceAlert.findByPk(id, { transaction });
    if (!alert) { const error = new Error('Alerta de manutenção não encontrado.'); error.status = 404; throw error; }
    await alert.update({ resolved: true }, { transaction });
    await syncVehicleStatus(alert.vehicleId, transaction);
    return alert;
  });
}

async function remove(id) {
  return MaintenanceAlert.sequelize.transaction(async (transaction) => {
    const alert = await MaintenanceAlert.findByPk(id, { transaction });
    if (!alert) { const error = new Error('Alerta de manutenção não encontrado.'); error.status = 404; throw error; }
    const vehicleId = alert.vehicleId;
    await alert.destroy({ transaction });
    await syncVehicleStatus(vehicleId, transaction);
    return alert;
  });
}

module.exports = { list, findById, create, update, resolve, remove, syncVehicleStatus };
