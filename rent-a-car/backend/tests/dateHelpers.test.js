const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeDateRange, calculateDaysBetween } = require('../utils/dateHelpers');

test('normalizeDateRange rejects equal or reversed dates as a client error', () => {
  assert.throws(() => normalizeDateRange('2026-07-20', '2026-07-20'), (error) => error.status === 400);
  assert.throws(() => normalizeDateRange('2026-07-21', '2026-07-20'), (error) => error.status === 400);
});

test('calculateDaysBetween is stable across UTC dates', () => {
  const { inicio, fim } = normalizeDateRange('2026-07-20', '2026-07-23');
  assert.equal(calculateDaysBetween(inicio, fim), 3);
});
