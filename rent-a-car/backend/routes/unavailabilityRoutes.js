const express = require('express');
const { createUnavailability } = require('../controllers/unavailabilityController');

const router = express.Router();

router.post('/', createUnavailability);

module.exports = router;