const test = require('node:test');
const assert = require('node:assert/strict');
const { toReservationResponse } = require('../controllers/reservationController');

test('toReservationResponse maps backend reservation fields to the shared contract', () => {
  const reservation = {
    id: 7,
    reference: 'RES-0007',
    userId: 3,
    vehicleId: 12,
    data_inicio: '2026-08-10',
    data_fim: '2026-08-14',
    estado: 'confirmada',
    preco_estimado: '420.00',
    extras: {},
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
    user: {
      id: 3,
      nome: 'Ana Silva',
      email: 'ana@example.com',
      tipo: 'cliente',
    },
    vehicle: {
      id: 12,
      brand: 'BMW',
      model: 'X3',
      plate: 'AA-11-BB',
      category: 'SUV',
      pricePerDay: '85.00',
      status: 'Disponível',
    },
  };

  const result = toReservationResponse(reservation);

  assert.deepEqual(result, {
    id: 7,
    reference: 'RES-0007',
    userId: 3,
    vehicleId: 12,
    data_inicio: '2026-08-10',
    data_fim: '2026-08-14',
    estado: 'confirmada',
    preco_estimado: '420.00',
    extras: {},
    status: 'confirmada',
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    totalPrice: '420.00',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
    user: {
      id: 3,
      name: 'Ana Silva',
      email: 'ana@example.com',
      role: 'cliente',
    },
    customer: {
      id: 3,
      firstName: 'Ana',
      lastName: 'Silva',
      email: 'ana@example.com',
    },
    vehicle: {
      id: 12,
      brand: 'BMW',
      model: 'X3',
      plate: 'AA-11-BB',
      category: 'SUV',
      pricePerDay: '85.00',
      status: 'Disponível',
    },
  });
});
