import React, { useState } from 'react';
import { Calendar, Clock, Home, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';
import { ShowingTimeSlot } from '../../types/propertyShowing';
import { Property } from '../../types/property';

type PropertyShowingCalendarProps = {
  property: Property;
  timeSlots: ShowingTimeSlot[];
  onAddTimeSlots: (slots: Omit<ShowingTimeSlot, 'id'>[]) => void;
  onRemoveTimeSlot: (slotId: string) => void;
};

export function PropertyShowingCalendar({
  property,
  timeSlots,
  onAddTimeSlots,
  onRemoveTimeSlot
}: PropertyShowingCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const getWeekDates = (date: Date) => {
    const week = [];
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const groupedSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, ShowingTimeSlot[]>);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{property.title}</h2>
              <p className="text-gray-600">{property.address}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={handlePrevWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-lg font-medium">
            {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
            {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </span>
          <Button variant="outline" onClick={handleNextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDates.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const daySlots = groupedSlots[dateStr] || [];

            return (
              <div
                key={dateStr}
                className="border rounded-lg p-4"
              >
                <div className="text-sm font-medium text-gray-600">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg font-bold mb-2">
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`text-sm p-2 rounded-lg flex items-center justify-between ${
                        slot.isBooked
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>
                      {slot.maxAttendees && (
                        <div className="flex items-center gap-1 text-xs">
                          <Users className="w-3 h-3" />
                          <span>
                            {slot.currentAttendees || 0}/{slot.maxAttendees}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}