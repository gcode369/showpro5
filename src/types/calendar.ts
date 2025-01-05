import type { ShowingTimeSlot } from './propertyShowing';

export type CalendarSlot = {
  date: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
};

export type TimeSlotInput = Omit<ShowingTimeSlot, 'id'>;

export type CalendarView = 'month' | 'week' | 'day';