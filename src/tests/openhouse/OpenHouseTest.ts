import { describe, test, expect } from 'vitest';
import { openHouseService } from '../../services/openHouse/OpenHouseService';

describe('Open House Management', () => {
  test('Create Open House', async () => {
    const openHouse = await openHouseService.createOpenHouse({
      propertyId: 'test-property-id',
      date: '2024-03-25',
      startTime: '14:00',
      endTime: '16:00',
      address: '123 Test St',
      city: 'Vancouver',
      province: 'BC',
      postalCode: 'V6B 2W2'
    });
    expect(openHouse).toBeTruthy();
    expect(openHouse.date).toBe('2024-03-25');
  });
});