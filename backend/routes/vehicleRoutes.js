const express = require('express');
const {
  listVehicles,
  createVehicle,
} = require('../controllers/vehicleController');
const { getAvailableVehicles } = require('../controllers/availabilityController');

const router = express.Router();

router.get('/', listVehicles);
router.post('/', createVehicle);
router.get('/available', getAvailableVehicles);

module.exports = router;