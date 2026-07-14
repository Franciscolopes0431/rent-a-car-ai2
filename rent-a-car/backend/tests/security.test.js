const test = require('node:test');
const assert = require('node:assert/strict');
const { Op } = require('sequelize');
const { normalizePagination } = require('../utils/pagination');
const { validateVehiclePayload } = require('../validators/vehicleValidator');
const { blockingReservationWhere, PENDING_TIMEOUT_MINUTES } = require('../services/reservationLifecycleService');
const { normalizeDateRange } = require('../utils/dateHelpers');
const { isStrongPassword } = require('../utils/passwordPolicy');

test('pagination rejects invalid values and caps large page sizes', () => {
  assert.deepEqual(normalizePagination('-1', 'not-a-number'), { page: 1, pageSize: 10, limit: 10, offset: 0 });
  assert.deepEqual(normalizePagination('2', '100000'), { page: 2, pageSize: 100, limit: 100, offset: 100 });
});

test('vehicle validation rejects zero and non-numeric daily prices', () => {
  assert.ok(validateVehiclePayload({ pricePerDay: 0 }, true).length > 0);
  assert.ok(validateVehiclePayload({ pricePerDay: 'abc' }, true).length > 0);
});

test('password policy requires length, upper, lower and number', () => {
  assert.equal(isStrongPassword('password'), false);
  assert.equal(isStrongPassword('Password'), false);
  assert.equal(isStrongPassword('Password1'), true);
});

test('reservation conflicts only include confirmed and recent pending reservations', () => {
  const { inicio, fim } = normalizeDateRange('2026-08-01', '2026-08-03');
  const where = blockingReservationWhere(inicio, fim);
  const statusRules = where[Op.and][2][Op.or];
  assert.equal(statusRules[0].estado, 'confirmada');
  assert.equal(statusRules[1].estado, 'pendente');
  const cutoff = statusRules[1].createdAt[Op.gte];
  assert.ok(cutoff instanceof Date);
  assert.ok(Date.now() - cutoff.getTime() <= (PENDING_TIMEOUT_MINUTES * 60 * 1000) + 1000);
});
