const express = require('express');
const {
  login,
  register,
  checkEmail,
  googleAuth,
  appleAuth,
} = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/check-email', checkEmail);
router.post('/google', googleAuth);
router.post('/apple', appleAuth);

module.exports = router;
