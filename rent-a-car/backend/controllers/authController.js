const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../middleware/authMiddleware');
const { isStrongPassword, PASSWORD_MESSAGE } = require('../utils/passwordPolicy');

async function verifyPassword(plainPassword, storedPassword, user) {
  if (!plainPassword || !storedPassword) {
    return false;
  }

  const normalizedStored = String(storedPassword).trim();
  const normalizedPlain = String(plainPassword);

  if (!normalizedStored.startsWith('$2')) return false;
  return bcrypt.compare(normalizedPlain, normalizedStored);
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.nome,
    email: user.email,
    role: user.tipo,
  };
}

async function login(req, res, next) {
  try {
    const { email, password, rememberMe = false } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email e password sao obrigatorios.',
      });
    }

    const user = await User.findOne({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const match = await verifyPassword(password, user.password, user);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = { id: user.id, authVersion: Number(user.authVersion || 0) };
    const persistentSession = rememberMe === true;
    const token = jwt.sign(payload, getJwtSecret(), {
      expiresIn: persistentSession ? '30d' : '8h',
    });

    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.COOKIE_SAME_SITE || 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    if (persistentSession) {
      cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;
    }

    res.cookie('rentcar_session', token, cookieOptions);
    return res.json({ user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function register(req, res, next) {
  try {
    const { nome, email, phone, password, confirmPassword, acceptTerms } = req.body;

    if (!nome || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: 'nome, email, password e confirmPassword sao obrigatorios.',
      });
    }

    if (String(password) !== String(confirmPassword)) {
      return res.status(400).json({ message: 'As passwords nao coincidem.' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: PASSWORD_MESSAGE });
    }

    if (acceptTerms !== true) {
      return res.status(400).json({ message: 'Tem de aceitar os termos e condicoes.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });

    if (existingUser) {
      return res.status(409).json({ message: 'Email ja registado.' });
    }

    const hashed = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      nome: String(nome).trim(),
      email: normalizedEmail,
      phone: phone ? String(phone).trim().slice(0, 30) : null,
      password: hashed,
      tipo: 'cliente',
    });

    return res.status(201).json({
      message: 'Conta criada com sucesso.',
      user: toPublicUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const nome = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!nome || !email) return res.status(400).json({ message: 'Nome e email são obrigatórios.' });
    const duplicate = await User.findOne({ where: { email } });
    if (duplicate && duplicate.id !== req.user.id) return res.status(409).json({ message: 'Este email já está a ser utilizado.' });
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });
    await user.update({ nome, email });
    return res.json(toPublicUser(user));
  } catch (error) {
    return next(error);
  }
}

async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !isStrongPassword(newPassword)) {
      return res.status(400).json({ message: PASSWORD_MESSAGE });
    }
    const user = await User.findByPk(req.user.id);
    if (!user || !(await verifyPassword(currentPassword, user.password, user))) {
      return res.status(400).json({ message: 'A palavra-passe atual está incorreta.' });
    }
    await user.update({
      password: await bcrypt.hash(String(newPassword), 10),
      authVersion: Number(user.authVersion || 0) + 1,
    });
    return res.json({ message: 'Palavra-passe atualizada com sucesso.' });
  } catch (error) {
    return next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });
    return res.json(toPublicUser(user));
  } catch (error) { return next(error); }
}

function logout(req, res) {
  res.clearCookie('rentcar_session', { httpOnly: true, sameSite: process.env.COOKIE_SAME_SITE || 'strict', secure: process.env.NODE_ENV === 'production', path: '/' });
  return res.status(204).send();
}

module.exports = {
  verifyPassword,
  login,
  register,
  updateProfile,
  updatePassword,
  getProfile,
  logout,
};
