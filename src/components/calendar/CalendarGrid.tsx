import React from 'react';
import { getDaysInMonth } from '../../utils/calendar';
import { CalendarCell } from './CalendarCell';
import type { ShowingTimeSlot } from '../../types/propertyShowing';

type CalendarGridProps = {
  currentDate: Date;
  timeSlots: Record<string, ShowingTimeSlot[]>;
  readOnly?: boolean;
  onSlotSelect?: (slot: ShowingTimeSlot) => void;
};

export function CalendarGrid({ currentDate, timeSlots, readOnly, onSlotSelect }: CalendarGridProps) {
  const days = getDaysInMonth(currentDate);

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
          {day}
        </div>
      ))}
      
      {days.map(({ date, isPadding }, index) => {
        const dateStr = date.toISOString().split('T')[0];
        const daySlots = timeSlots[dateStr] || [];

        return (
          <CalendarCell
            key={index}
            date={date}
            slots={daySlots}
            isPadding={isPadding}
            readOnly={readOnly}
            onSlotSelect={onSlotSelect}
          />
        );
      })}
    </div>
  );
}