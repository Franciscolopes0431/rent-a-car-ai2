const express = require('express');
const {
  listMaintenance,
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  resolveMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenanceController');

const router = express.Router();

router.get('/', listMaintenance);
router.get('/:id', getMaintenance);
router.post('/', createMaintenance);
router.put('/:id', updateMaintenance);
router.patch('/:id/resolve', resolveMaintenance);
router.delete('/:id', deleteMaintenance);

module.exports = router;