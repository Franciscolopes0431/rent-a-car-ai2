const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { getStats, getAlerts } = require('../controllers/dashboardController');

const router = express.Router();

router.use(authenticate);
router.get('/stats', getStats);
router.get('/alerts', getAlerts);

module.exports = router;
