import { prisma } from '../config/database';
import type { RecurringPattern } from '../types/calendar';

export class RecurringAvailabilityService {
  async setRecurringAvailability(agentId: string, pattern: RecurringPattern) {
    return await prisma.recurringAvailability.upsert({
      where: { agentId },
      update: { pattern },
      create: {
        agentId,
        pattern
      }
    });
  }

  async generateTimeSlots(agentId: string, startDate: Date, endDate: Date) {
    const pattern = await prisma.recurringAvailability.findUnique({
      where: { agentId }
    });

    if (!pattern) return [];

    const timeSlots = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const dayPattern = pattern.pattern.days[dayOfWeek];

      if (dayPattern) {
        for (const slot of dayPattern.slots) {
          timeSlots.push({
            date: new Date(currentDate),
            startTime: slot.start,
            endTime: slot.end,
            agentId,
            maxAttendees: pattern.pattern.defaultMaxAttendees
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return timeSlots;
  }
}