const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../middleware/authMiddleware');

async function verifyPassword(plainPassword, storedPassword, user) {
  if (!plainPassword || !storedPassword) {
    return false;
  }

  const normalizedStored = String(storedPassword).trim();
  const normalizedPlain = String(plainPassword);

  if (normalizedStored.startsWith('$2')) {
    const match = await bcrypt.compare(normalizedPlain, normalizedStored);
    return match;
  }

  if (normalizedStored === normalizedPlain) {
    const hashedPassword = await bcrypt.hash(normalizedPlain, 10);
    await user.update({ password: hashedPassword });
    return true;
  }

  return false;
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

    const payload = { id: user.id, role: user.tipo, email: user.email, name: user.nome };
    const persistentSession = rememberMe === true;
    const token = jwt.sign(payload, getJwtSecret(), {
      expiresIn: persistentSession ? '30d' : '8h',
    });

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'strict',
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
    const { nome, email, password, tipo, confirmPassword, acceptTerms } = req.body;

    if (!nome || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: 'nome, email, password e confirmPassword sao obrigatorios.',
      });
    }

    if (String(password) !== String(confirmPassword)) {
      return res.status(400).json({ message: 'As passwords nao coincidem.' });
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

async function checkEmail(req, res, next) {
  try {
    const email = String(req.query.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: 'Parametro email e obrigatorio.' });
    }

    const existingUser = await User.findOne({ where: { email } });

    return res.json({
      available: !existingUser,
    });
  } catch (error) {
    return next(error);
  }
}

async function googleAuth(req, res) {
  return res.status(501).json({
    message: 'Login com Google ainda nao implementado.',
  });
}

async function appleAuth(req, res) {
  return res.status(501).json({
    message: 'Login com Apple ainda nao implementado.',
  });
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
    if (!currentPassword || !newPassword || String(newPassword).length < 8) {
      return res.status(400).json({ message: 'Indique a palavra-passe atual e uma nova com pelo menos 8 caracteres.' });
    }
    const user = await User.findByPk(req.user.id);
    if (!user || !(await verifyPassword(currentPassword, user.password, user))) {
      return res.status(400).json({ message: 'A palavra-passe atual está incorreta.' });
    }
    await user.update({ password: await bcrypt.hash(String(newPassword), 10) });
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
  res.clearCookie('rentcar_session', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/' });
  return res.status(204).send();
}

module.exports = {
  verifyPassword,
  login,
  register,
  checkEmail,
  googleAuth,
  appleAuth,
  updateProfile,
  updatePassword,
  getProfile,
  logout,
};
