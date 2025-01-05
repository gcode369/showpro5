import React from 'react';
import { Clock, Users } from 'lucide-react';
import type { ShowingTimeSlot } from '../../types/propertyShowing';

type CalendarSlotProps = {
  slot: ShowingTimeSlot;
  selected: boolean;
  onSelect: (slot: ShowingTimeSlot) => void;
};

export function CalendarSlot({ slot, selected, onSelect }: CalendarSlotProps) {
  return (
    <div
      onClick={() => !slot.is_booked && onSelect(slot)}
      className={`
        p-2 rounded-lg cursor-pointer transition-colors
        ${slot.is_booked 
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
          : selected
            ? 'bg-blue-100 text-blue-800'
            : 'bg-white hover:bg-blue-50 text-gray-800'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{slot.start_time} - {slot.end_time}</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Users className="w-3 h-3" />
          <span>
            {slot.current_attendees || 0}/{slot.max_attendees || 1}
          </span>
        </div>
      </div>
    </div>
  );
}