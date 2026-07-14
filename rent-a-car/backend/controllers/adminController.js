const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, AuditLog, AppSetting } = require('../models');
const { isStrongPassword, PASSWORD_MESSAGE } = require('../utils/passwordPolicy');

const STAFF_ROLES = ['gestor', 'admin'];
const SETTING_DEFAULTS = {
  companyName: 'RentCar',
  supportEmail: 'geral@rentcar.pt',
  supportPhone: '+351 210 000 000',
  currency: 'EUR',
  cancellationHours: 48,
  upcomingReminderDays: 3,
};

const publicStaff = (user) => ({ id: user.id, name: user.nome, email: user.email, role: user.tipo, createdAt: user.createdAt, updatedAt: user.updatedAt });

async function listStaff(req, res, next) {
  try {
    const users = await User.findAll({ where: { tipo: { [Op.in]: STAFF_ROLES } }, order: [['nome', 'ASC']] });
    return res.json(users.map(publicStaff));
  } catch (error) { return next(error); }
}

async function createStaff(req, res, next) {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const role = String(req.body.role || 'gestor');
    if (name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !isStrongPassword(password) || !STAFF_ROLES.includes(role)) return res.status(400).json({ message: PASSWORD_MESSAGE });
    if (await User.findOne({ where: { email } })) return res.status(409).json({ message: 'Já existe uma conta com este email.' });
    const user = await User.create({ nome: name, email, password: await bcrypt.hash(password, 10), tipo: role });
    return res.status(201).json(publicStaff(user));
  } catch (error) { return next(error); }
}

async function updateStaff(req, res, next) {
  try {
    const user = await User.findOne({ where: { id: req.params.id, tipo: { [Op.in]: STAFF_ROLES } } });
    if (!user) return res.status(404).json({ message: 'Membro da equipa não encontrado.' });
    const name = String(req.body.name || user.nome).trim();
    const email = String(req.body.email || user.email).trim().toLowerCase();
    const role = String(req.body.role || user.tipo);
    if (name.length < 2 || !STAFF_ROLES.includes(role)) return res.status(400).json({ message: 'Dados ou função inválidos.' });
    const duplicate = await User.findOne({ where: { email, id: { [Op.ne]: user.id } } });
    if (duplicate) return res.status(409).json({ message: 'Já existe uma conta com este email.' });
    if (user.id === req.user.id && role !== 'admin') return res.status(409).json({ message: 'Não pode remover a sua própria permissão de administrador.' });
    if (user.tipo === 'admin' && role !== 'admin' && await User.count({ where: { tipo: 'admin' } }) <= 1) return res.status(409).json({ message: 'Tem de existir pelo menos um administrador.' });
    await user.update({
      nome: name,
      email,
      tipo: role,
      ...(role !== user.tipo ? { authVersion: Number(user.authVersion || 0) + 1 } : {}),
    });
    return res.json(publicStaff(user));
  } catch (error) { return next(error); }
}

async function updateStaffPassword(req, res, next) {
  try {
    const password = String(req.body.password || '');
    if (!isStrongPassword(password)) return res.status(400).json({ message: PASSWORD_MESSAGE });
    const user = await User.findOne({ where: { id: req.params.id, tipo: { [Op.in]: STAFF_ROLES } } });
    if (!user) return res.status(404).json({ message: 'Membro da equipa não encontrado.' });
    await user.update({
      password: await bcrypt.hash(password, 10),
      authVersion: Number(user.authVersion || 0) + 1,
    });
    return res.json({ message: 'Palavra-passe atualizada.' });
  } catch (error) { return next(error); }
}

async function deleteStaff(req, res, next) {
  try {
    const user = await User.findOne({ where: { id: req.params.id, tipo: { [Op.in]: STAFF_ROLES } } });
    if (!user) return res.status(404).json({ message: 'Membro da equipa não encontrado.' });
    if (user.id === req.user.id) return res.status(409).json({ message: 'Não pode eliminar a sua própria conta.' });
    if (user.tipo === 'admin' && await User.count({ where: { tipo: 'admin' } }) <= 1) return res.status(409).json({ message: 'Tem de existir pelo menos um administrador.' });
    await user.destroy();
    return res.status(204).send();
  } catch (error) { return next(error); }
}

async function listAuditLogs(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 20)));
    const where = {};
    if (req.query.role) where.actorRole = req.query.role;
    if (req.query.action) where.action = req.query.action;
    const { rows, count } = await AuditLog.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit: pageSize, offset: (page - 1) * pageSize });
    return res.json({ data: rows, pagination: { page, pageSize, total: count, totalPages: Math.ceil(count / pageSize) } });
  } catch (error) { return next(error); }
}

async function getSettings(req, res, next) {
  try {
    const rows = await AppSetting.findAll();
    return res.json(rows.reduce((values, row) => ({ ...values, [row.key]: row.value }), { ...SETTING_DEFAULTS }));
  } catch (error) { return next(error); }
}

async function updateSettings(req, res, next) {
  try {
    const allowedKeys = Object.keys(SETTING_DEFAULTS);
    const values = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedKeys.includes(key)));
    if (!Object.keys(values).length) return res.status(400).json({ message: 'Não foram indicadas configurações válidas.' });
    if (values.cancellationHours !== undefined && (!Number.isFinite(Number(values.cancellationHours)) || Number(values.cancellationHours) < 0)) return res.status(400).json({ message: 'As horas de cancelamento são inválidas.' });
    if (values.upcomingReminderDays !== undefined && (!Number.isFinite(Number(values.upcomingReminderDays)) || Number(values.upcomingReminderDays) < 0)) return res.status(400).json({ message: 'Os dias de aviso são inválidos.' });
    await Promise.all(Object.entries(values).map(([key, value]) => AppSetting.upsert({ key, value, updatedById: req.user.id })));
    return getSettings(req, res, next);
  } catch (error) { return next(error); }
}

module.exports = { listStaff, createStaff, updateStaff, updateStaffPassword, deleteStaff, listAuditLogs, getSettings, updateSettings };
