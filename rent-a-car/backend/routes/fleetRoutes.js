const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getStatus } = require('../controllers/fleetController');

const router = express.Router();

router.use(authMiddleware);
router.get('/status', getStatus);

module.exports = router;
