const { Op, fn, col, literal } = require('sequelize');
const { sequelize, Booking, Vehicle, Customer } = require('../models');

function parseDate(value) {
  return value ? new Date(value) : null;
}

function buildPeriodRange({ from, to }) {
  const start = parseDate(from) || new Date(0);
  const end = parseDate(to) || new Date();
  return [start, end];
}

async function revenueByPeriod({ from, to, groupBy = 'day' }) {
  const [start, end] = buildPeriodRange({ from, to });
  const dateFn = groupBy === 'month'
    ? fn('date_trunc', 'month', col('created_at'))
    : fn('date_trunc', 'day', col('created_at'));

  return Booking.findAll({
    attributes: [
      [dateFn, 'period'],
      [fn('SUM', col('total_price')), 'revenue'],
      [fn('COUNT', col('id')), 'bookings'],
    ],
    where: {
      status: { [Op.in]: ['Confirmada', 'Em curso', 'Concluída'] },
      createdAt: { [Op.between]: [start, end] },
    },
    group: ['period'],
    order: [[col('period'), 'ASC']],
    raw: true,
  });
}

async function bookingsByStatus({ from, to }) {
  const [start, end] = buildPeriodRange({ from, to });

  return Booking.findAll({
    attributes: [
      'status',
      [fn('COUNT', col('id')), 'count'],
    ],
    where: {
      createdAt: { [Op.between]: [start, end] },
    },
    group: ['status'],
    order: [[fn('COUNT', col('id')), 'DESC']],
    raw: true,
  });
}

async function topVehicles({ limit = 5, from, to }) {
  const [start, end] = buildPeriodRange({ from, to });

  const rows = await Booking.findAll({
    attributes: [
      'vehicleId',
      [fn('COUNT', col('Booking.id')), 'reservations'],
      [fn('SUM', col('total_price')), 'revenue'],
    ],
    where: {
      createdAt: { [Op.between]: [start, end] },
    },
    include: [{ model: Vehicle, as: 'vehicle', attributes: ['brand', 'model', 'plate'] }],
    group: ['vehicle.id', 'Booking.vehicleId'],
    order: [[literal('revenue'), 'DESC']],
    limit: Number(limit),
    raw: true,
    nest: true,
  });

  return rows.map((row) => ({
    vehicle: `${row.vehicle.brand} ${row.vehicle.model}`,
    plate: row.vehicle.plate,
    reservations: Number(row.reservations),
    revenue: Number(row.revenue),
  }));
}

async function topCustomers({ limit = 5, from, to }) {
  const [start, end] = buildPeriodRange({ from, to });

  const rows = await Booking.findAll({
    attributes: [
      'customerId',
      [fn('COUNT', col('Booking.id')), 'reservations'],
      [fn('SUM', col('total_price')), 'revenue'],
    ],
    where: {
      createdAt: { [Op.between]: [start, end] },
    },
    include: [{ model: Customer, as: 'customer', attributes: ['firstName', 'lastName', 'email'] }],
    group: ['customer.id', 'Booking.customerId'],
    order: [[literal('revenue'), 'DESC']],
    limit: Number(limit),
    raw: true,
    nest: true,
  });

  return rows.map((row) => ({
    customer: `${row.customer.firstName} ${row.customer.lastName}`,
    email: row.customer.email,
    reservations: Number(row.reservations),
    revenue: Number(row.revenue),
  }));
}

async function fleetUtilization({ from, to, limit = 10 }) {
  const [start, end] = buildPeriodRange({ from, to });
  const periodDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

  const bookings = await Booking.findAll({
    where: {
      status: { [Op.in]: ['Confirmada', 'Em curso'] },
      [Op.and]: [
        { startDate: { [Op.lte]: end } },
        { endDate: { [Op.gte]: start } },
      ],
    },
    include: [{ model: Vehicle, as: 'vehicle', attributes: ['id', 'brand', 'model', 'plate'] }],
  });

  const utilization = {};

  bookings.forEach((booking) => {
    const intervalStart = new Date(Math.max(new Date(booking.startDate), start));
    const intervalEnd = new Date(Math.min(new Date(booking.endDate), end));
    const days = Math.max(1, Math.ceil((intervalEnd - intervalStart) / (1000 * 60 * 60 * 24)) + 1);
    const vehicleKey = booking.vehicle.id;
    utilization[vehicleKey] = (utilization[vehicleKey] || 0) + days;
  });

  const vehicles = await Vehicle.findAll({
    attributes: ['id', 'brand', 'model', 'plate'],
  });

  return vehicles
    .map((vehicle) => {
      const bookedDays = utilization[vehicle.id] || 0;
      return {
        vehicle: `${vehicle.brand} ${vehicle.model}`,
        plate: vehicle.plate,
        utilization: Number(((bookedDays / periodDays) * 100).toFixed(1)),
        bookedDays,
        periodDays,
      };
    })
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, Number(limit));
}

module.exports = {
  revenueByPeriod,
  bookingsByStatus,
  topVehicles,
  topCustomers,
  fleetUtilization,
};