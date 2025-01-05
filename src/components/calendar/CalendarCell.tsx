import React from 'react';
import { Clock, Users } from 'lucide-react';
import type { ShowingTimeSlot } from '../../types/propertyShowing';

type CalendarCellProps = {
  date: Date;
  slots: ShowingTimeSlot[];
  isPadding: boolean;
  readOnly?: boolean;
  onSlotSelect?: (slot: ShowingTimeSlot) => void;
};

export function CalendarCell({ date, slots, isPadding, readOnly, onSlotSelect }: CalendarCellProps) {
  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <div
      className={`min-h-[100px] p-2 border rounded-lg ${
        isPadding ? 'bg-gray-50' : 'bg-white'
      } ${isToday ? 'border-blue-500' : 'border-gray-200'}`}
    >
      <div className={`text-sm font-medium ${isPadding ? 'text-gray-400' : 'text-gray-900'}`}>
        {date.getDate()}
      </div>
      
      <div className="mt-1 space-y-1">
        {slots.map((slot) => (
          <div
            key={slot.id}
            onClick={() => !readOnly && !slot.isBooked && onSlotSelect?.(slot)}
            className={`
              text-xs p-1 rounded cursor-pointer flex items-center justify-between
              ${slot.isBooked
                ? 'bg-gray-100 text-gray-500'
                : readOnly
                ? 'bg-blue-50 text-blue-800'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }
              ${!readOnly && !slot.isBooked ? 'cursor-pointer' : 'cursor-default'}
            `}
          >
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{slot.startTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{slot.currentAttendees}/{slot.maxAttendees}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}