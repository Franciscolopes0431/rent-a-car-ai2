const { Op } = require('sequelize');
const { Notification, Reservation } = require('../models');
const { getSetting } = require('./settingService');

async function notify({ userId, type, title, message, link = null, eventKey = null }) {
  if (!userId) return null;
  if (eventKey) {
    const [notification] = await Notification.findOrCreate({
      where: { eventKey },
      defaults: { userId, type, title, message, link, eventKey },
    });
    return notification;
  }
  return Notification.create({ userId, type, title, message, link });
}

async function ensureUpcomingReservationNotifications(userId) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + Number(await getSetting('upcomingReminderDays', 3)));
  const format = (date) => date.toISOString().slice(0, 10);
  const reservations = await Reservation.findAll({
    where: { userId, estado: 'confirmada', data_inicio: { [Op.between]: [format(start), format(end)] } },
  });
  await Promise.all(reservations.map((reservation) => notify({
    userId,
    type: 'reserva_proxima',
    title: 'Levantamento próximo',
    message: `A reserva ${reservation.reference || `#${reservation.id}`} começa a ${reservation.data_inicio}.`,
    link: '/cliente/minhas-reservas',
    eventKey: `reservation-upcoming:${reservation.id}`,
  })));
}

module.exports = { notify, ensureUpcomingReservationNotifications };
