const customerService = require('../services/customerService');
const { validateCustomerPayload } = require('../validators/customerValidator');

async function listCustomers(req, res, next) {
  try {
    const result = await customerService.list(req.query);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getCustomer(req, res, next) {
  try {
    const result = await customerService.findById(req.params.id);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function createCustomer(req, res, next) {
  try {
    const errors = validateCustomerPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const customer = await customerService.create(req.body);
    return res.status(201).json(customer);
  } catch (error) {
    return next(error);
  }
}

async function updateCustomer(req, res, next) {
  try {
    const errors = validateCustomerPayload(req.body, true);
    if (errors.length) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const customer = await customerService.update(req.params.id, req.body);
    return res.json(customer);
  } catch (error) {
    return next(error);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    await customerService.remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};