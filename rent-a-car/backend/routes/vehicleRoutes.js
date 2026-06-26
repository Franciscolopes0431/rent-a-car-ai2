const express = require('express');
const {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  changeVehicleStatus,
} = require('../controllers/vehicleController');

const router = express.Router();

router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);
router.patch('/:id/status', changeVehicleStatus);

module.exports = router;