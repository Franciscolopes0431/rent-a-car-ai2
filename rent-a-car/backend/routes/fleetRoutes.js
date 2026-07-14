const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { getStatus } = require('../controllers/fleetController');

const router = express.Router();

router.use(authenticate, authorize(['admin', 'gestor']));
router.get('/status', getStatus);

module.exports = router;
