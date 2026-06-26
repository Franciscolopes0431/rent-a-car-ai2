const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getStats, getAlerts } = require('../controllers/dashboardController');

const router = express.Router();

router.use(authMiddleware);
router.get('/stats', getStats);
router.get('/alerts', getAlerts);

module.exports = router;
