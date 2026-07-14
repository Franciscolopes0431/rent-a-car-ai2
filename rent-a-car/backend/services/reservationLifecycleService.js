const { Op } = require('sequelize');
const { Reservation } = require('../models');
const { notify } = require('./notificationService');

const PENDING_TIMEOUT_MINUTES = Math.max(5, Number(process.env.PENDING_RESERVATION_MINUTES || 30));

function pendingCutoff() {
  return new Date(Date.now() - PENDING_TIMEOUT_MINUTES * 60 * 1000);
}

function blockingReservationWhere(inicio, fim) {
  return {
    [Op.and]: [
      { data_inicio: { [Op.lt]: fim } },
      { data_fim: { [Op.gt]: inicio } },
      {
        [Op.or]: [
          { estado: 'confirmada' },
          { estado: 'pendente', createdAt: { [Op.gte]: pendingCutoff() } },
        ],
      },
    ],
  };
}

async function expirePendingReservations() {
  const expired = await Reservation.findAll({
    where: { estado: 'pendente', createdAt: { [Op.lt]: pendingCutoff() } },
    attributes: ['id', 'userId'],
  });
  if (!expired.length) return 0;
  await Reservation.update({ estado: 'cancelada' }, { where: { id: { [Op.in]: expired.map((item) => item.id) } } });
  await Promise.all(expired.map((reservation) => notify({
    userId: reservation.userId,
    type: 'reserva_expirada',
    title: 'Reserva pendente expirada',
    message: `A reserva #${reservation.id} foi cancelada por não ter sido confirmada dentro do prazo.`,
    link: '/cliente/historico',
    eventKey: `reservation-expired:${reservation.id}`,
  })));
  return expired.length;
}

async function completeExpiredReservations() {
  const today = new Date().toISOString().slice(0, 10);
  const expired = await Reservation.findAll({
    where: { estado: 'confirmada', data_fim: { [Op.lt]: today } },
    attributes: ['id', 'userId'],
  });
  if (!expired.length) return 0;
  await Reservation.update({ estado: 'concluida' }, { where: { id: { [Op.in]: expired.map((item) => item.id) } } });
  await Promise.all(expired.map((reservation) => notify({
    userId: reservation.userId,
    type: 'reserva_concluida',
    title: 'Reserva concluída',
    message: `A reserva #${reservation.id} foi concluída. Já pode avaliar a experiência.`,
    link: '/cliente/avaliacoes',
    eventKey: `reservation-completed:${reservation.id}`,
  })));
  return expired.length;
}

async function runReservationLifecycle() {
  await expirePendingReservations();
  await completeExpiredReservations();
}

module.exports = {
  PENDING_TIMEOUT_MINUTES,
  blockingReservationWhere,
  expirePendingReservations,
  completeExpiredReservations,
  runReservationLifecycle,
};
