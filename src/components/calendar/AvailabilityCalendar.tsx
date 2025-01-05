import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, X } from 'lucide-react';
import { Button } from '../common/Button';
import { AgentAvailability, TimeSlot } from '../../types/availability';

type AvailabilityCalendarProps = {
  availability: AgentAvailability;
  onUpdate: (availability: AgentAvailability) => void;
};

export function AvailabilityCalendar({ availability, onUpdate }: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);

  const handleAddTimeSlot = (date: string, slot: TimeSlot) => {
    const updatedSchedule = [...availability.schedule];
    const dayIndex = updatedSchedule.findIndex(day => day.date === date);

    if (dayIndex === -1) {
      updatedSchedule.push({ date, slots: [slot] });
    } else {
      updatedSchedule[dayIndex].slots.push(slot);
    }

    onUpdate({
      ...availability,
      schedule: updatedSchedule
    });
  };

  const handleRemoveTimeSlot = (date: string, slotIndex: number) => {
    const updatedSchedule = availability.schedule.map(day => {
      if (day.date === date) {
        return {
          ...day,
          slots: day.slots.filter((_, index) => index !== slotIndex)
        };
      }
      return day;
    });

    onUpdate({
      ...availability,
      schedule: updatedSchedule
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Set Your Availability</h2>
        <Button onClick={() => setShowTimeSlotModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Time Slot
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 31 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          const daySchedule = availability.schedule.find(day => day.date === dateStr);

          return (
            <div
              key={dateStr}
              className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 ${
                selectedDate === dateStr ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedDate(dateStr)}
            >
              <div className="text-sm font-medium">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-lg font-bold mb-2">
                {date.getDate()}
              </div>
              {daySchedule?.slots.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm bg-blue-100 rounded px-2 py-1 mb-1"
                >
                  <span>{slot.start}-{slot.end}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTimeSlot(dateStr, index);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {showTimeSlotModal && (
        <TimeSlotModal
          onClose={() => setShowTimeSlotModal(false)}
          onAdd={(slot) => {
            if (selectedDate) {
              handleAddTimeSlot(selectedDate, slot);
              setShowTimeSlotModal(false);
            }
          }}
        />
      )}
    </div>
  );
}

type TimeSlotModalProps = {
  onClose: () => void;
  onAdd: (slot: TimeSlot) => void;
};

function TimeSlotModal({ onClose, onAdd }: TimeSlotModalProps) {
  const [slot, setSlot] = useState<TimeSlot>({
    start: '09:00',
    end: '17:00'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Add Time Slot</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={slot.start}
              onChange={(e) => setSlot({ ...slot, start: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={slot.end}
              onChange={(e) => setSlot({ ...slot, end: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onAdd(slot)}>Add Slot</Button>
        </div>
      </div>
    </div>
  );
}