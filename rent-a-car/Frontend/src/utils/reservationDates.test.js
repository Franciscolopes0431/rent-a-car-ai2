import { describe, expect, it } from 'vitest';
import { calculateRentalDays, validateReservationDates } from './reservationDates';

describe('reservation dates', () => {
  it('calculates days consistently in UTC', () => {
    expect(calculateRentalDays('2026-08-01', '2026-08-04')).toBe(3);
  });

  it('rejects missing, past and reversed dates', () => {
    expect(validateReservationDates('', '', '2026-08-01')).toContain('Selecione');
    expect(validateReservationDates('2026-07-31', '2026-08-02', '2026-08-01')).toContain('partir de hoje');
    expect(validateReservationDates('2026-08-03', '2026-08-02', '2026-08-01')).toContain('posterior');
    expect(validateReservationDates('2026-08-01', '2026-09-15', '2026-08-01')).toContain('30 dias');
    expect(validateReservationDates('2026-08-01', '2026-08-02', '2026-08-01')).toBe('');
  });
});
