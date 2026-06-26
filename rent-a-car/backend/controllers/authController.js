const { randomUUID } = require('crypto');
const { User } = require('../models');

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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email e password sao obrigatorios.',
      });
    }

    const user = await User.findOne({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: 'Credenciais invalidas.',
      });
    }

    // Token de desenvolvimento para destravar o fluxo frontend.
    const token = `dev-${user.id}-${randomUUID()}`;

    return res.json({
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function register(req, res, next) {
  try {
    const { nome, email, password, tipo } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({
        message: 'nome, email e password sao obrigatorios.',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });

    if (existingUser) {
      return res.status(409).json({ message: 'Email ja registado.' });
    }

    const user = await User.create({
      nome: String(nome).trim(),
      email: normalizedEmail,
      password: String(password),
      tipo: tipo === 'admin' ? 'admin' : 'cliente',
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

module.exports = {
  login,
  register,
  checkEmail,
  googleAuth,
  appleAuth,
};
