import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { CalendarGrid } from './CalendarGrid';
import { ShowingTimeSlotModal } from './ShowingTimeSlotModal';
import { useCalendarSync } from '../../hooks/useCalendarSync';
import { useAuthStore } from '../../store/authStore';
import type { ShowingTimeSlot } from '../../types/propertyShowing';

type PropertyCalendarProps = {
  propertyId: string;
  readOnly?: boolean;
  onSlotSelect?: (slot: ShowingTimeSlot) => void;
};

export function PropertyCalendar({ propertyId, readOnly = false, onSlotSelect }: PropertyCalendarProps) {
  const { user } = useAuthStore();
  const { timeSlotsByProperty, addTimeSlots, loading, error } = useCalendarSync(user?.id);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleAddTimeSlots = async (slots: Omit<ShowingTimeSlot, 'id'>[]) => {
    const success = await addTimeSlots(propertyId, slots);
    if (success) {
      setShowModal(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading calendar...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600 text-center">{error}</div>;
  }

  const propertySlots = timeSlotsByProperty[propertyId] || {};

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handlePrevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-lg font-medium">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="outline" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        {!readOnly && (
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Time Slots
          </Button>
        )}
      </div>

      <CalendarGrid
        currentDate={currentDate}
        timeSlots={propertySlots}
        readOnly={readOnly}
        onSlotSelect={onSlotSelect}
      />

      {showModal && (
        <ShowingTimeSlotModal
          propertyId={propertyId}
          onClose={() => setShowModal(false)}
          onAdd={handleAddTimeSlots}
        />
      )}
    </div>
  );
}