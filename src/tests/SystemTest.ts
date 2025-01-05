import { describe, test, expect, beforeAll } from 'vitest';
import { supabase } from '../services/supabase';
import { authService } from '../services/auth/AuthService';
import { propertyService } from '../services/property/PropertyService';
import { bookingService } from '../services/booking/BookingService';
import { openHouseService } from '../services/openHouse/OpenHouseService';

describe('System Tests', () => {
  beforeAll(() => {
    // Set up test data
    vi.mock('../services/supabase');
  });

  test('Agent Registration', async () => {
    const result = await authService.register('test.agent@example.com', 'Test123!', {
      name: 'Test Agent',
      role: 'agent'
    });
    expect(result.user).toBeTruthy();
  });

  test('Property Management', async () => {
    const property = await propertyService.createProperty({
      title: 'Test Property',
      address: '123 Test St',
      city: 'Vancouver',
      price: 500000,
      description: 'Test property',
      category: 'residential',
      type: 'house',
      status: 'available'
    });
    expect(property).toBeTruthy();
  });

  test('Booking Management', async () => {
    const timeSlot = await bookingService.createTimeSlot({
      propertyId: 'test-property-id',
      date: '2024-03-25',
      startTime: '10:00',
      endTime: '11:00',
      maxAttendees: 1
    });
    expect(timeSlot).toBeTruthy();
  });

  test('Open House Management', async () => {
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
  });
});