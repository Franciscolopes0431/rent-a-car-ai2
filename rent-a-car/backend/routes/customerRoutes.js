const express = require('express');
const {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, authorize(['admin', 'gestor']), listCustomers);
router.get('/:id', authenticate, authorize(['admin', 'gestor']), getCustomer);
router.post('/', authenticate, authorize(['admin', 'gestor']), createCustomer);
router.put('/:id', authenticate, authorize(['admin', 'gestor']), updateCustomer);
router.delete('/:id', authenticate, authorize(['admin']), deleteCustomer);

module.exports = router;
