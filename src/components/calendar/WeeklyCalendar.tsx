import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import { TimeSlotModal } from './TimeSlotModal';
import { WeeklyTimeSlots } from './WeeklyTimeSlots';
import type { TimeSlot } from '../../types/availability';

type WeeklyCalendarProps = {
  availability: Record<string, TimeSlot[]>;
  onUpdateAvailability: (date: string, slots: TimeSlot[]) => void;
};

export function WeeklyCalendar({ availability, onUpdateAvailability }: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const handleAddTimeSlot = (date: string, newSlot: TimeSlot) => {
    const existingSlots = availability[date] || [];
    onUpdateAvailability(date, [...existingSlots, newSlot].sort((a, b) => 
      a.start.localeCompare(b.start)
    ));
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrevWeek}
                className="hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-3 py-1 text-sm font-medium text-gray-700">
                {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
                {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNextWeek}
                className="hover:bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <WeeklyTimeSlots
          weekDates={weekDates}
          availability={availability}
          onDateSelect={handleDateSelect}
          onUpdateAvailability={onUpdateAvailability}
        />
      </div>

      {showModal && selectedDate && (
        <TimeSlotModal
          onClose={() => setShowModal(false)}
          onAdd={(slot) => {
            handleAddTimeSlot(selectedDate, slot);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}