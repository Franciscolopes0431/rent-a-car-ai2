const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { getStats, getAlerts } = require('../controllers/dashboardController');

const router = express.Router();

router.use(authenticate);
router.use(authorize(['admin', 'gestor']));
router.get('/stats', getStats);
router.get('/alerts', getAlerts);

module.exports = router;
