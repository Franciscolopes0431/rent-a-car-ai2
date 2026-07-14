const { rateLimit } = require('express-rate-limit');

function limiter(options) {
  return rateLimit({
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: { message: 'Foram efetuados demasiados pedidos. Tente novamente mais tarde.' },
    ...options,
  });
}

const loginLimiter = limiter({ windowMs: 15 * 60 * 1000, limit: 10 });
const registrationLimiter = limiter({ windowMs: 60 * 60 * 1000, limit: 10 });
const publicContactLimiter = limiter({ windowMs: 15 * 60 * 1000, limit: 5 });
const reservationCreateLimiter = limiter({ windowMs: 60 * 60 * 1000, limit: 20 });

module.exports = {
  loginLimiter,
  registrationLimiter,
  publicContactLimiter,
  reservationCreateLimiter,
};
