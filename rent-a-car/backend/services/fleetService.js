const { Op } = require('sequelize');
const { Vehicle, Reservation } = require('../models');

async function getStatus() {
  const today = new Date().toISOString().slice(0, 10);
  const [allVehicles, activeReservations] = await Promise.all([
    Vehicle.findAll({ order: [['updatedAt', 'DESC']] }),
    Reservation.findAll({
      where: {
        estado: 'confirmada',
        data_inicio: { [Op.lte]: today },
        data_fim: { [Op.gt]: today },
      },
      attributes: ['vehicleId'],
    }),
  ]);
  const reservedIds = new Set(activeReservations.map((item) => Number(item.vehicleId)));
  const effectiveStatus = (vehicle) => vehicle.status === 'Manutenção'
    ? 'Manutenção'
    : reservedIds.has(Number(vehicle.id)) ? 'Reservado' : 'Disponível';

  const summary = {
    available: 0,
    reserved: 0,
    maintenance: 0,
  };

  allVehicles.forEach((vehicle) => {
    const status = effectiveStatus(vehicle);
    if (status === 'Disponível') summary.available += 1;
    if (status === 'Reservado') summary.reserved += 1;
    if (status === 'Manutenção') summary.maintenance += 1;
  });

  return {
    summary,
    vehicles: allVehicles.slice(0, 10).map((vehicle) => ({
      model: `${vehicle.brand} ${vehicle.model}`,
      plate: vehicle.plate,
      category: vehicle.category,
      pricePerDay: Number(vehicle.pricePerDay),
      status: effectiveStatus(vehicle),
    })),
  };
}

module.exports = { getStatus };
