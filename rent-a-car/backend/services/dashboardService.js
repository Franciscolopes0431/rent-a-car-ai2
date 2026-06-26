const { Op } = require('sequelize');
const { Vehicle, Booking, MaintenanceAlert } = require('../models');

const ACTIVE_STATUSES = ['Confirmada', 'Em curso'];
const REVENUE_STATUSES = ['Confirmada', 'Em curso', 'Concluída'];

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

async function getStats() {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const previousMonthStart = startOfPreviousMonth(now);
  const previousMonthEnd = endOfPreviousMonth(now);
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

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
    Booking.count({ where: { status: { [Op.in]: ACTIVE_STATUSES } } }),
    Booking.count({ where: { status: 'Pendente' } }),
    Booking.count({
      where: {
        status: { [Op.in]: ACTIVE_STATUSES },
        endDate: { [Op.between]: [todayStart, todayEnd] },
      },
    }),
    Booking.sum('totalPrice', {
      where: {
        status: { [Op.in]: REVENUE_STATUSES },
        createdAt: { [Op.gte]: currentMonthStart },
      },
    }),
    Booking.sum('totalPrice', {
      where: {
        status: { [Op.in]: REVENUE_STATUSES },
        createdAt: { [Op.between]: [previousMonthStart, previousMonthEnd] },
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
