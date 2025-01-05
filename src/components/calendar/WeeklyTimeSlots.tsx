import React from 'react';
import { X, Clock, Plus } from 'lucide-react';
import type { TimeSlot } from '../../types/availability';

type WeeklyTimeSlotsProps = {
  weekDates: Date[];
  availability: Record<string, TimeSlot[]>;
  onDateSelect: (date: string) => void;
  onUpdateAvailability: (date: string, slots: TimeSlot[]) => void;
};

export function WeeklyTimeSlots({ 
  weekDates, 
  availability, 
  onDateSelect,
  onUpdateAvailability 
}: WeeklyTimeSlotsProps) {
  const handleRemoveSlot = (date: string, slotToRemove: TimeSlot) => {
    const existingSlots = availability[date] || [];
    onUpdateAvailability(
      date,
      existingSlots.filter(slot => 
        slot.start !== slotToRemove.start || slot.end !== slotToRemove.end
      )
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDates.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const slots = availability[dateStr] || [];
        const today = isToday(date);

        return (
          <div
            key={dateStr}
            className={`
              border rounded-xl p-4 min-h-[200px] transition-all
              hover:border-blue-200 hover:shadow-sm relative group
              ${today ? 'bg-blue-50/50 border-blue-200' : 'border-gray-100'}
            `}
          >
            <div className="text-sm font-medium text-gray-600">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-bold mb-3 ${today ? 'text-blue-600' : 'text-gray-900'}`}>
              {date.getDate()}
            </div>
            <div className="space-y-2">
              {slots.map((slot, index) => (
                <div
                  key={`${dateStr}-${index}`}
                  className="group/slot flex items-center justify-between bg-white border border-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      {slot.start} - {slot.end}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSlot(dateStr, slot);
                    }}
                    className="opacity-0 group-hover/slot:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => onDateSelect(dateStr)}
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
            >
              <div className="bg-white p-2 rounded-full shadow-lg">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}