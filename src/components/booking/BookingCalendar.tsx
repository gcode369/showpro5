import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';
import { CalendarSlot } from '../calendar/CalendarSlot';
import { useCalendarState } from '../../hooks/useCalendarState';
import type { Property } from '../../types/property';

type BookingCalendarProps = {
  property: Property;
  onSlotSelect: (date: string, slotId: string) => void;
};

export function BookingCalendar({ property, onSlotSelect }: BookingCalendarProps) {
  const {
    slotsByDate,
    selectedDate,
    selectedSlot,
    loading,
    handleDateSelect,
    handleSlotSelect
  } = useCalendarState(property.id);

  const dates = Object.keys(slotsByDate).sort();
  const currentWeekIndex = dates.findIndex(date => date === selectedDate) || 0;
  const visibleDates = dates.slice(currentWeekIndex, currentWeekIndex + 7);

  const handlePrevWeek = () => {
    const prevIndex = Math.max(0, currentWeekIndex - 7);
    handleDateSelect(dates[prevIndex]);
  };

  const handleNextWeek = () => {
    const nextIndex = Math.min(dates.length - 7, currentWeekIndex + 7);
    handleDateSelect(dates[nextIndex]);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading available time slots...</div>;
  }

  if (dates.length === 0) {
    return <div className="p-4 text-center">No available time slots</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevWeek} disabled={currentWeekIndex === 0}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-medium">
          {new Date(visibleDates[0]).toLocaleDateString()} - {' '}
          {new Date(visibleDates[visibleDates.length - 1]).toLocaleDateString()}
        </span>
        <Button variant="outline" onClick={handleNextWeek} disabled={currentWeekIndex >= dates.length - 7}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {visibleDates.map(date => (
          <div key={date} className="space-y-2">
            <div className="text-sm font-medium text-gray-600">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
              <br />
              {new Date(date).getDate()}
            </div>
            <div className="space-y-1">
              {slotsByDate[date]?.map(slot => (
                <CalendarSlot
                  key={slot.id}
                  slot={slot}
                  selected={selectedSlot?.id === slot.id}
                  onSelect={() => {
                    handleSlotSelect(slot);
                    onSlotSelect(date, slot.id);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}