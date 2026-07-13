const express = require('express');
const {
  listMaintenance,
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  resolveMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenanceController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, authorize(['admin', 'gestor']), listMaintenance);
router.get('/:id', authenticate, authorize(['admin', 'gestor']), getMaintenance);
router.post('/', authenticate, authorize(['admin', 'gestor']), createMaintenance);
router.put('/:id', authenticate, authorize(['admin', 'gestor']), updateMaintenance);
router.patch('/:id/resolve', authenticate, authorize(['admin', 'gestor']), resolveMaintenance);
router.delete('/:id', authenticate, authorize(['admin']), deleteMaintenance);

module.exports = router;
