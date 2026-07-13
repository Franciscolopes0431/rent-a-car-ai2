const express = require('express');
const {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  changeVehicleStatus,
} = require('../controllers/vehicleController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { getAvailableVehicles } = require('../controllers/availabilityController');

const router = express.Router();

router.get('/', listVehicles);
router.get('/available/search', getAvailableVehicles);
router.get('/:id', getVehicle);
router.post('/', authenticate, authorize(['admin', 'gestor']), createVehicle);
router.put('/:id', authenticate, authorize(['admin', 'gestor']), updateVehicle);
router.delete('/:id', authenticate, authorize(['admin']), deleteVehicle);
router.patch('/:id/status', authenticate, authorize(['admin', 'gestor']), changeVehicleStatus);

module.exports = router;
