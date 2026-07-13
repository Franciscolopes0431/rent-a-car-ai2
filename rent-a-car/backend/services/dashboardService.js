const { Op } = require('sequelize');
const { Vehicle, Reservation, MaintenanceAlert } = require('../models');

const ACTIVE_STATUSES = ['confirmada'];
const REVENUE_STATUSES = ['confirmada', 'concluida'];

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date) {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfPreviousMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

function endOfPreviousMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59, 999);
}

function normalizeStatusValue(value) {
  if (value === null || value === undefined) return null;

  const text = String(value).trim();
  const statusMap = {
    0: 'pendente',
    1: 'confirmada',
    2: 'cancelada',
    pendente: 'pendente',
    confirmada: 'confirmada',
    concluida: 'concluida',
    cancelada: 'cancelada',
  };

  return statusMap[text.toLowerCase()] || text;
}

async function getStats() {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const previousMonthStart = startOfPreviousMonth(now);
  const previousMonthEnd = endOfPreviousMonth(now);
  const today = now.toISOString().slice(0, 10);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  const previousMonthStartDate = previousMonthStart.toISOString().slice(0, 10);
  const previousMonthEndDate = previousMonthEnd.toISOString().slice(0, 10);


  try {
    const [
      totalVehicles,
      vehiclesAddedThisMonth,
      activeBookings,
      pendingBookings,
      bookingsEndingToday,
      monthRevenue,
      prevMonthRevenue,
    ] = await Promise.all([
      Vehicle.count(),
      Vehicle.count({ where: { createdAt: { [Op.gte]: currentMonthStart } } }),
      Reservation.count({ where: { estado: { [Op.in]: ACTIVE_STATUSES }, data_fim: { [Op.gte]: today } } }),
      Reservation.count({ where: { estado: 'pendente' } }),
      Reservation.count({
        where: {
          estado: { [Op.in]: ACTIVE_STATUSES },
          data_fim: today,
        },
      }),
      Reservation.sum('preco_estimado', {
        where: {
          estado: { [Op.in]: REVENUE_STATUSES },
          data_inicio: { [Op.between]: [currentMonthStart.toISOString().slice(0, 10), currentMonthEnd] },
        },
      }),
      Reservation.sum('preco_estimado', {
        where: {
          estado: { [Op.in]: REVENUE_STATUSES },
          data_inicio: { [Op.between]: [previousMonthStartDate, previousMonthEndDate] },
        },
      }),
    ]);

    const currentRevenue = Number(monthRevenue || 0);
    const previousRevenue = Number(prevMonthRevenue || 0);
    const revenueChangePct = previousRevenue > 0
      ? Number((((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1))
      : null;

    return {
      totalVehicles,
      activeBookings,
      pendingBookings,
      monthRevenue: currentRevenue,
      vehiclesAddedThisMonth,
      bookingsEndingToday,
      revenueChangePct,
    };
  } catch (error) {
    throw error;
  }
}

async function getAlerts() {
  const alerts = await MaintenanceAlert.findAll({
    where: { resolved: false },
    include: [{ model: Vehicle, as: 'vehicle', attributes: ['brand', 'model', 'plate'] }],
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  return alerts.map((alert) => ({
    id: alert.id,
    vehicle: {
      model: `${alert.vehicle.brand} ${alert.vehicle.model}`,
      plate: alert.vehicle.plate,
    },
    type: alert.type,
    description: alert.description,
    unavailableUntil: alert.unavailableUntil,
  }));
}

module.exports = {
  getStats,
  getAlerts,
};
