const { SupportTicket, SupportMessage, Review, Reservation, Vehicle, User } = require('../models');
const { notify } = require('../services/notificationService');

const privileged = (user) => ['admin', 'gestor'].includes(user?.role);

async function listTickets(req, res, next) {
  try {
    const where = privileged(req.user) ? {} : { userId: req.user.id };
    const data = await SupportTicket.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'nome', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 200,
    });
    return res.json(data);
  } catch (error) { return next(error); }
}

async function createTicket(req, res, next) {
  try {
    const { reservationId } = req.body;
    const subject = String(req.body.subject || '').trim();
    const message = String(req.body.message || '').trim();
    if (subject.length < 3 || subject.length > 120 || message.length < 10 || message.length > 5000) return res.status(400).json({ message: 'Use um assunto entre 3 e 120 caracteres e uma mensagem entre 10 e 5000 caracteres.' });
    if (reservationId) {
      const reservation = await Reservation.findOne({ where: { id: reservationId, userId: req.user.id } });
      if (!reservation) return res.status(404).json({ message: 'Reserva associada não encontrada.' });
    }
    const ticket = await SupportTicket.create({ userId: req.user.id, reservationId: reservationId || null, subject, message, origin: 'area_cliente' });
    return res.status(201).json({ ...ticket.toJSON(), reference: `SUP-${String(ticket.id).padStart(6, '0')}` });
  } catch (error) { return next(error); }
}

async function createPublicTicket(req, res, next) {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const phone = String(req.body.phone || '').trim();
    const subject = String(req.body.subject || '').trim();
    const message = String(req.body.message || '').trim();
    if (name.length < 2 || subject.length < 3 || message.length < 10 || message.length > 5000 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ message: 'Preencha o nome, um email válido, o assunto e uma mensagem com pelo menos 10 caracteres.' });
    }
    const ticket = await SupportTicket.create({
      userId: null,
      reservationId: null,
      guestName: name.slice(0, 120),
      guestEmail: email.slice(0, 180),
      guestPhone: phone ? phone.slice(0, 30) : null,
      subject: subject.slice(0, 120),
      message: message.slice(0, 5000),
      origin: 'contacto_publico',
    });
    return res.status(201).json({ reference: `SUP-${String(ticket.id).padStart(6, '0')}` });
  } catch (error) { return next(error); }
}

async function updateTicket(req, res, next) {
  try {
    const ticket = await SupportTicket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Pedido não encontrado.' });
    if (!['recebido', 'em_analise', 'resolvido'].includes(req.body.status)) return res.status(400).json({ message: 'Estado inválido.' });
    await ticket.update({ status: req.body.status });
    return res.json(ticket);
  } catch (error) { return next(error); }
}

async function deleteTicket(req, res, next) {
  try {
    const ticket = await SupportTicket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Pedido não encontrado.' });
    await ticket.destroy();
    return res.status(204).send();
  } catch (error) { return next(error); }
}

async function listTicketMessages(req, res, next) {
  try {
    const ticket = await SupportTicket.findByPk(req.params.id, { include: [{ model: User, as: 'user', attributes: ['id', 'nome'] }] });
    if (!ticket) return res.status(404).json({ message: 'Pedido não encontrado.' });
    if (!privileged(req.user) && ticket.userId !== req.user.id) return res.status(403).json({ message: 'Sem acesso a este pedido.' });
    const messages = await SupportMessage.findAll({
      where: { ticketId: ticket.id },
      include: [{ model: User, as: 'sender', attributes: ['id', 'nome', 'tipo'] }],
      order: [['createdAt', 'ASC']],
    });
    return res.json([{
      id: `initial-${ticket.id}`,
      senderRole: ticket.origin === 'contacto_publico' ? 'visitante' : 'cliente',
      sender: ticket.user || (ticket.guestName ? { nome: ticket.guestName } : null),
      message: ticket.message,
      createdAt: ticket.createdAt,
    }, ...messages]);
  } catch (error) { return next(error); }
}

async function createTicketMessage(req, res, next) {
  try {
    const ticket = await SupportTicket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Pedido não encontrado.' });
    if (!privileged(req.user) && ticket.userId !== req.user.id) return res.status(403).json({ message: 'Sem acesso a este pedido.' });
    const message = String(req.body.message || '').trim();
    if (!message || message.length > 2000) return res.status(400).json({ message: 'Escreva uma mensagem com até 2000 caracteres.' });
    const reply = await SupportMessage.create({ ticketId: ticket.id, senderId: req.user.id, senderRole: req.user.role, message });
    await ticket.update({ status: privileged(req.user) ? 'em_analise' : 'recebido' });
    if (privileged(req.user) && ticket.userId) await notify({
      userId: ticket.userId,
      type: 'ticket_respondido',
      title: 'Nova resposta do apoio',
      message: `O pedido SUP-${String(ticket.id).padStart(6, '0')} recebeu uma resposta.`,
      link: '/cliente/suporte',
    });
    return res.status(201).json(reply);
  } catch (error) { return next(error); }
}

async function listReviews(req, res, next) {
  try {
    const data = await Review.findAll({
      where: { userId: req.user.id },
      include: [{ model: Reservation, as: 'reservation', include: [{ model: Vehicle, as: 'vehicle' }] }],
      order: [['createdAt', 'DESC']],
    });
    return res.json(data);
  } catch (error) { return next(error); }
}

async function listPublicReviews(req, res, next) {
  try {
    const vehicleWhere = req.query.vehicleId ? { vehicleId: req.query.vehicleId } : {};
    const data = await Review.findAll({
      where: { moderationStatus: 'aprovada' },
      attributes: ['id', 'rating', 'comment', 'adminResponse', 'createdAt'],
      include: [
        { model: User, as: 'user', attributes: ['nome'] },
        { model: Reservation, as: 'reservation', where: vehicleWhere, required: true, attributes: ['vehicleId'], include: [{ model: Vehicle, as: 'vehicle', attributes: ['id', 'brand', 'model'] }] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    return res.json(data.map((review) => {
      const value = review.toJSON();
      const names = String(value.user?.nome || 'Cliente').trim().split(/\s+/);
      value.user = { displayName: names.length > 1 ? `${names[0]} ${names.at(-1)[0]}.` : names[0] };
      return value;
    }));
  } catch (error) { return next(error); }
}

async function listManagedReviews(req, res, next) {
  try {
    const where = req.query.status ? { moderationStatus: req.query.status } : {};
    const data = await Review.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'moderator', attributes: ['id', 'nome'] },
        { model: Reservation, as: 'reservation', include: [{ model: Vehicle, as: 'vehicle', attributes: ['id', 'brand', 'model', 'plate'] }] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 200,
    });
    return res.json(data);
  } catch (error) { return next(error); }
}

async function moderateReview(req, res, next) {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Avaliação não encontrada.' });
    const moderationStatus = String(req.body.moderationStatus || '');
    const adminResponse = String(req.body.adminResponse || '').trim();
    if (!['pendente', 'aprovada', 'oculta'].includes(moderationStatus)) return res.status(400).json({ message: 'Estado de moderação inválido.' });
    if (adminResponse.length > 500) return res.status(400).json({ message: 'A resposta não pode exceder 500 caracteres.' });
    await review.update({
      moderationStatus,
      adminResponse: adminResponse || null,
      moderatedById: req.user.id,
      moderatedAt: new Date(),
    });
    await notify({
      userId: review.userId,
      type: 'avaliacao_moderada',
      title: moderationStatus === 'aprovada' ? 'Avaliação publicada' : moderationStatus === 'oculta' ? 'Avaliação ocultada' : 'Avaliação em análise',
      message: moderationStatus === 'aprovada' ? 'A sua avaliação foi aprovada e já pode aparecer publicamente.' : moderationStatus === 'oculta' ? 'A sua avaliação foi ocultada pela equipa.' : 'A sua avaliação voltou a ficar em análise.',
      link: '/cliente/avaliacoes',
    });
    return res.json(review);
  } catch (error) { return next(error); }
}

async function deleteReview(req, res, next) {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Avaliação não encontrada.' });
    await review.destroy();
    return res.status(204).send();
  } catch (error) { return next(error); }
}

async function createReview(req, res, next) {
  try {
    const { reservationId, rating, comment } = req.body;
    const today = new Date().toISOString().slice(0, 10);
    const reservation = await Reservation.findOne({ where: { id: reservationId, userId: req.user.id, estado: 'concluida' } });
    if (!reservation || reservation.data_fim >= today) return res.status(409).json({ message: 'Só pode avaliar uma reserva concluída.' });
    const review = await Review.create({ userId: req.user.id, reservationId, rating: Number(rating), comment: String(comment || '').trim(), moderationStatus: 'pendente' });
    return res.status(201).json(review);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ message: 'Esta reserva já foi avaliada.' });
    return next(error);
  }
}

module.exports = { listTickets, createTicket, createPublicTicket, updateTicket, deleteTicket, listTicketMessages, createTicketMessage, listReviews, listPublicReviews, listManagedReviews, moderateReview, deleteReview, createReview };
