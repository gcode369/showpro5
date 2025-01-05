```typescript
import { prisma } from '../config/database';
import { io } from '../socket';

export class NotificationService {
  async sendBookingNotification(booking: any) {
    const notification = await prisma.notification.create({
      data: {
        userId: booking.agentId,
        type: 'BOOKING_REQUEST',
        title: 'New Booking Request',
        message: `You have a new booking request for property showing`,
        read: false
      }
    });

    // Send real-time notification
    io.to(booking.agentId).emit('notification', notification);

    return notification;
  }

  async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
  }
}
```