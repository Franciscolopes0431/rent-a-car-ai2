const reportService = require('../services/reportService');

async function getRevenueReport(req, res, next) {
  try {
    const data = await reportService.revenueByPeriod(req.query);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

async function getBookingsByStatus(req, res, next) {
  try {
    const data = await reportService.bookingsByStatus(req.query);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

async function getTopVehicles(req, res, next) {
  try {
    const data = await reportService.topVehicles(req.query);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

async function getTopCustomers(req, res, next) {
  try {
    const data = await reportService.topCustomers(req.query);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

async function getFleetUtilization(req, res, next) {
  try {
    const data = await reportService.fleetUtilization(req.query);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getRevenueReport,
  getBookingsByStatus,
  getTopVehicles,
  getTopCustomers,
  getFleetUtilization,
};