```typescript
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { NotificationService } from './notificationService';

export class BookingService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async createBooking(data: any) {
    const { propertyId, agentId, clientId, timeSlotId, attendees, notes } = data;

    // Start a transaction
    return await prisma.$transaction(async (tx) => {
      // Check if time slot is still available
      const timeSlot = await tx.showingTimeSlot.findUnique({
        where: { id: timeSlotId },
        include: { showing: true }
      });

      if (!timeSlot || timeSlot.isBooked) {
        throw new Error('Time slot is no longer available');
      }

      if (timeSlot.currentAttendees + attendees > timeSlot.maxAttendees) {
        throw new Error('Exceeds maximum attendees limit');
      }

      // Create booking
      const booking = await tx.booking.create({
        data: {
          propertyId,
          agentId,
          clientId,
          timeSlotId,
          status: 'PENDING',
          attendees,
          notes
        }
      });

      // Update time slot
      await tx.showingTimeSlot.update({
        where: { id: timeSlotId },
        data: {
          isBooked: true,
          currentAttendees: timeSlot.currentAttendees + attendees
        }
      });

      // Send notifications
      await this.notificationService.sendBookingNotification(booking);

      // Invalidate relevant caches
      await redis.del(`showings:${timeSlot.showing.id}`);
      await redis.del(`bookings:agent:${agentId}`);
      await redis.del(`bookings:client:${clientId}`);

      return booking;
    });
  }
}
```