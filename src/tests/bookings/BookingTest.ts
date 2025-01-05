import { describe, test, expect } from 'vitest';
import { bookingService } from '../../services/booking/BookingService';

describe('Booking Management', () => {
  test('Create Time Slot', async () => {
    const timeSlot = await bookingService.createTimeSlot({
      propertyId: 'test-property-id',
      date: '2024-03-25',
      startTime: '10:00',
      endTime: '11:00',
      maxAttendees: 1
    });
    expect(timeSlot).toBeTruthy();
    expect(timeSlot.date).toBe('2024-03-25');
  });
});