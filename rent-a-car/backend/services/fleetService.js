const { fn, col } = require('sequelize');
const { Vehicle } = require('../models');

async function getStatus() {
  const [summaryRows, vehicles] = await Promise.all([
    Vehicle.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status'],
      raw: true,
    }),
    Vehicle.findAll({
      order: [['updatedAt', 'DESC']],
      limit: 10,
    }),
  ]);

  const summary = {
    available: 0,
    reserved: 0,
    maintenance: 0,
  };

  summaryRows.forEach((row) => {
    if (row.status === 'Disponível') {
      summary.available = Number(row.count);
    }

    if (row.status === 'Reservado') {
      summary.reserved = Number(row.count);
    }

    if (row.status === 'Manutenção') {
      summary.maintenance = Number(row.count);
    }
  });

  return {
    summary,
    vehicles: vehicles.map((vehicle) => ({
      model: `${vehicle.brand} ${vehicle.model}`,
      plate: vehicle.plate,
      category: vehicle.category,
      pricePerDay: Number(vehicle.pricePerDay),
      status: vehicle.status,
    })),
  };
}

module.exports = { getStatus };
