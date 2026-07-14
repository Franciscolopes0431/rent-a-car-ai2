const { Op, fn, col } = require('sequelize');
const { Reservation, Vehicle, User } = require('../models');

function dateOnly(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const error = new Error('Período do relatório inválido.');
    error.status = 400;
    throw error;
  }
  return date.toISOString().slice(0, 10);
}

const safeLimit = (value, fallback) => Math.min(100, Math.max(1, Number.isInteger(Number(value)) ? Number(value) : fallback));

function buildPeriodRange({ from, to }) {
  const now = new Date();
  const start = from ? dateOnly(from) : `${now.getFullYear()}-01-01`;
  const end = to ? dateOnly(to) : dateOnly(now);
  return [start, end];
}

async function revenueByPeriod({ from, to, groupBy = 'day' }) {
  const [start, end] = buildPeriodRange({ from, to });
  const dateFn = groupBy === 'month'
    ? fn('date_trunc', 'month', col('data_inicio'))
    : fn('date_trunc', 'day', col('data_inicio'));
  return Reservation.findAll({
    attributes: [[dateFn, 'period'], [fn('SUM', col('preco_estimado')), 'revenue'], [fn('COUNT', col('id')), 'bookings']],
    where: { estado: { [Op.in]: ['confirmada', 'concluida'] }, data_inicio: { [Op.between]: [start, end] } },
    group: ['period'], order: [[col('period'), 'ASC']], raw: true,
  });
}

async function bookingsByStatus({ from, to }) {
  const [start, end] = buildPeriodRange({ from, to });
  return Reservation.findAll({
    attributes: ['estado', [fn('COUNT', col('id')), 'count']],
    where: { data_inicio: { [Op.between]: [start, end] } },
    group: ['estado'], order: [[fn('COUNT', col('id')), 'DESC']], raw: true,
  }).then((rows) => rows.map((row) => ({ status: row.estado, count: row.count })));
}

async function topVehicles({ limit = 5, from, to }) {
  const [start, end] = buildPeriodRange({ from, to });
  const rows = await Reservation.findAll({
    attributes: ['vehicleId', [fn('COUNT', col('Reservation.id')), 'reservations'], [fn('SUM', col('preco_estimado')), 'revenue']],
    where: { estado: { [Op.in]: ['confirmada', 'concluida'] }, data_inicio: { [Op.between]: [start, end] } },
    include: [{ model: Vehicle, as: 'vehicle', attributes: ['brand', 'model', 'plate'] }],
    group: ['vehicleId', 'vehicle.id'], order: [[fn('SUM', col('preco_estimado')), 'DESC']], limit: safeLimit(limit, 5), subQuery: false,
  });
  return rows.map((row) => ({
    vehicle: `${row.vehicle?.brand || 'Viatura'} ${row.vehicle?.model || ''}`.trim(),
    plate: row.vehicle?.plate || '-', reservations: Number(row.get('reservations') || 0), revenue: Number(row.get('revenue') || 0),
  }));
}

async function topCustomers({ limit = 5, from, to }) {
  const [start, end] = buildPeriodRange({ from, to });
  const rows = await Reservation.findAll({
    attributes: ['userId', [fn('COUNT', col('Reservation.id')), 'reservations'], [fn('SUM', col('preco_estimado')), 'revenue']],
    where: { estado: { [Op.in]: ['confirmada', 'concluida'] }, data_inicio: { [Op.between]: [start, end] } },
    include: [{ model: User, as: 'user', attributes: ['nome', 'email'] }],
    group: ['userId', 'user.id'], order: [[fn('SUM', col('preco_estimado')), 'DESC']], limit: safeLimit(limit, 5), subQuery: false,
  });
  return rows.map((row) => ({
    customer: row.user?.nome || 'Cliente sem nome', email: row.user?.email || '-',
    reservations: Number(row.get('reservations') || 0), revenue: Number(row.get('revenue') || 0),
  }));
}

async function fleetUtilization({ from, to, limit = 10 }) {
  const [start, end] = buildPeriodRange({ from, to });
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  const periodDays = Math.max(1, Math.ceil((endDate - startDate) / 86400000) + 1);
  const reservations = await Reservation.findAll({
    where: {
      estado: { [Op.in]: ['confirmada', 'concluida'] },
      [Op.and]: [{ data_inicio: { [Op.lte]: end } }, { data_fim: { [Op.gte]: start } }],
    },
  });
  const daysByVehicle = {};
  reservations.forEach((reservation) => {
    const intervalStart = new Date(`${reservation.data_inicio < start ? start : reservation.data_inicio}T00:00:00Z`);
    const intervalEnd = new Date(`${reservation.data_fim > end ? end : reservation.data_fim}T00:00:00Z`);
    daysByVehicle[reservation.vehicleId] = (daysByVehicle[reservation.vehicleId] || 0) + Math.max(1, Math.ceil((intervalEnd - intervalStart) / 86400000));
  });
  const vehicles = await Vehicle.findAll({ attributes: ['id', 'brand', 'model', 'plate'] });
  return vehicles.map((vehicle) => {
    const bookedDays = Math.min(periodDays, daysByVehicle[vehicle.id] || 0);
    return { vehicle: `${vehicle.brand} ${vehicle.model}`, plate: vehicle.plate, utilization: Number(((bookedDays / periodDays) * 100).toFixed(1)), bookedDays, periodDays };
  }).sort((a, b) => b.utilization - a.utilization).slice(0, safeLimit(limit, 10));
}

module.exports = { revenueByPeriod, bookingsByStatus, topVehicles, topCustomers, fleetUtilization };
