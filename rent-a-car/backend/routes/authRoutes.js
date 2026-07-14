const express = require('express');
const {
  login,
  register,
  updateProfile,
  updatePassword,
  getProfile,
  logout,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();
const { loginLimiter, registrationLimiter } = require('../middleware/rateLimiters');

router.post('/login', loginLimiter, login);
router.post('/register', registrationLimiter, register);
router.put('/me', authenticate, updateProfile);
router.put('/password', authenticate, updatePassword);
router.get('/me', authenticate, getProfile);
router.post('/logout', logout);

module.exports = router;
