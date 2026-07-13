const { Notification } = require('../models');
const { ensureUpcomingReservationNotifications } = require('../services/notificationService');

async function listNotifications(req, res, next) {
  try {
    await ensureUpcomingReservationNotifications(req.user.id);
    const data = await Notification.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']], limit: 100 });
    return res.json({ data, unread: data.filter((item) => !item.readAt).length });
  } catch (error) { return next(error); }
}

async function markRead(req, res, next) {
  try {
    const notification = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!notification) return res.status(404).json({ message: 'Notificação não encontrada.' });
    await notification.update({ readAt: notification.readAt || new Date() });
    return res.json(notification);
  } catch (error) { return next(error); }
}

async function markAllRead(req, res, next) {
  try {
    await Notification.update({ readAt: new Date() }, { where: { userId: req.user.id, readAt: null } });
    return res.status(204).send();
  } catch (error) { return next(error); }
}

module.exports = { listNotifications, markRead, markAllRead };
