const express = require('express');
const {
  login,
  register,
  checkEmail,
  googleAuth,
  appleAuth,
  updateProfile,
  updatePassword,
  getProfile,
  logout,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/check-email', checkEmail);
router.post('/google', googleAuth);
router.post('/apple', appleAuth);
router.put('/me', authenticate, updateProfile);
router.put('/password', authenticate, updatePassword);
router.get('/me', authenticate, getProfile);
router.post('/logout', logout);

module.exports = router;
