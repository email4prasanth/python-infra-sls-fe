import { describe, expect, it, vi, type Mock } from 'vitest';

vi.mock('zipcodes', () => ({
  default: {
    lookup: vi.fn(),
  },
}));

import zipcodes from 'zipcodes';
import { isValidZipCode } from './zip-code';

describe('isValidZipCode', () => {
  it('returns true for a valid US zip code', () => {
    (zipcodes.lookup as unknown as Mock).mockReturnValue({
      city: 'New York',
      state: 'NY',
      zip: '10001',
      latitude: 0,
      longitude: 0,
      country: '',
    });

    expect(isValidZipCode('10001')).toBe(true);
  });

  it('returns true for a valid Canadian zip code', () => {
    (zipcodes.lookup as unknown as Mock).mockReturnValue({
      city: 'Toronto',
      state: 'ON',
      zip: 'M4B1B3',
      latitude: 0,
      longitude: 0,
      country: '',
    });

    expect(isValidZipCode('M4B1B3')).toBe(true);
  });

  it('returns false for an invalid zip code', () => {
    (zipcodes.lookup as unknown as Mock).mockReturnValue(null);
    expect(isValidZipCode('XYZ123')).toBe(false);
  });

  it('returns false for an empty zip code', () => {
    (zipcodes.lookup as unknown as Mock).mockReturnValue(null);
    expect(isValidZipCode('')).toBe(false);
  });
});
