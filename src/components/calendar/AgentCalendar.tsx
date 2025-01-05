import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Building2, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { PropertySelector } from './PropertySelector';
import { TimeSlotModal } from './TimeSlotModal';
import { useProperties } from '../../hooks/useProperties';
import { usePropertyShowings } from '../../hooks/usePropertyShowings';
import { useAuthStore } from '../../store/authStore';
import type { Property } from '../../types/property';
import type { ShowingTimeSlot } from '../../types/propertyShowing';

export function AgentCalendar() {
  const { user } = useAuthStore();
  const { properties } = useProperties(user?.id);
  const { showings, addPropertyShowing, updateShowingTimeSlots, removePropertyShowing } = usePropertyShowings(user?.id || '');
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(properties[0] || null);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ShowingTimeSlot | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add padding days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({ date: prevDate, isPadding: true });
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isPadding: false });
    }

    // Add padding days from next month
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isPadding: true });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleAddTimeSlot = (date: Date) => {
    if (!selectedProperty) return;
    setEditingSlot(null);
    setShowTimeSlotModal(true);
  };

  const handleEditTimeSlot = (slot: ShowingTimeSlot) => {
    setEditingSlot(slot);
    setShowTimeSlotModal(true);
  };

  const handleSaveTimeSlot = (timeSlot: Omit<ShowingTimeSlot, 'id'>) => {
    if (!selectedProperty) return;

    const currentShowing = showings.find(s => s.propertyId === selectedProperty.id);

    if (editingSlot) {
      // Update existing time slot
      if (currentShowing) {
        const updatedSlots = currentShowing.timeSlots.map(slot =>
          slot.id === editingSlot.id ? { ...timeSlot, id: slot.id } : slot
        );
        updateShowingTimeSlots(currentShowing.id, updatedSlots);
      }
    } else {
      // Add new time slot
      if (currentShowing) {
        const newSlot = { ...timeSlot, id: Math.random().toString(36).substr(2, 9) };
        updateShowingTimeSlots(currentShowing.id, [...currentShowing.timeSlots, newSlot]);
      } else {
        addPropertyShowing(selectedProperty, [{ ...timeSlot, id: Math.random().toString(36).substr(2, 9) }]);
      }
    }

    setShowTimeSlotModal(false);
    setEditingSlot(null);
  };

  const handleDeleteTimeSlot = (slotId: string) => {
    if (!selectedProperty) return;

    const currentShowing = showings.find(s => s.propertyId === selectedProperty.id);
    if (currentShowing) {
      const updatedSlots = currentShowing.timeSlots.filter(slot => slot.id !== slotId);
      updateShowingTimeSlots(currentShowing.id, updatedSlots);
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const currentShowing = selectedProperty 
    ? showings.find(s => s.propertyId === selectedProperty.id)
    : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <PropertySelector
              properties={properties}
              selectedProperty={selectedProperty}
              onSelect={setSelectedProperty}
            />
            <Button
              onClick={() => handleAddTimeSlot(new Date())}
              disabled={!selectedProperty}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Time Slot
            </Button>
          </div>
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
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
          {daysInMonth.map(({ date, isPadding }, index) => {
            const dateStr = date.toISOString().split('T')[0];
            const daySlots = currentShowing?.timeSlots.filter(slot => slot.date === dateStr) || [];

            return (
              <div
                key={index}
                className={`bg-white p-2 min-h-[120px] ${
                  isPadding ? 'text-gray-400' : 'text-gray-900'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${
                    date.toDateString() === new Date().toDateString()
                      ? 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full'
                      : ''
                  }`}>
                    {date.getDate()}
                  </span>
                  {!isPadding && selectedProperty && (
                    <button
                      onClick={() => handleAddTimeSlot(date)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {daySlots.map(slot => (
                    <div
                      key={slot.id}
                      className={`text-xs p-1 rounded cursor-pointer ${
                        slot.isBooked
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                      }`}
                      onClick={() => !slot.isBooked && handleEditTimeSlot(slot)}
                    >
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{slot.startTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showTimeSlotModal && selectedProperty && (
        <TimeSlotModal
          property={selectedProperty}
          timeSlot={editingSlot}
          onClose={() => {
            setShowTimeSlotModal(false);
            setEditingSlot(null);
          }}
          onSave={handleSaveTimeSlot}
          onDelete={editingSlot ? () => handleDeleteTimeSlot(editingSlot.id) : undefined}
        />
      )}
    </div>
  );
}