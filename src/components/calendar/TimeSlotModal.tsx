import React, { useState } from 'react';
import { X, Clock, Users, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import type { TimeSlotInput } from '../../types/calendar';

type TimeSlotModalProps = {
  propertyId: string;
  agentId: string;
  onClose: () => void;
  onAdd: (slots: TimeSlotInput[]) => void;
};

export function TimeSlotModal({ propertyId, agentId, onClose, onAdd }: TimeSlotModalProps) {
  const [slots, setSlots] = useState<TimeSlotInput[]>([{
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    maxAttendees: 1,
    propertyId,
    agentId,
    isBooked: false,
    currentAttendees: 0
  }]);

  const handleAddSlot = () => {
    const lastSlot = slots[slots.length - 1];
    const [hours, minutes] = lastSlot.endTime.split(':');
    const nextStart = lastSlot.endTime;
    const nextEnd = `${String(Number(hours) + 1).padStart(2, '0')}:${minutes}`;

    setSlots([...slots, {
      ...lastSlot,
      startTime: nextStart,
      endTime: nextEnd
    }]);
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index: number, field: keyof TimeSlotInput, value: string | number) => {
    setSlots(slots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(slots);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Time Slots</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={slots[0].date}
              onChange={(e) => {
                const newDate = e.target.value;
                setSlots(slots.map(slot => ({ ...slot, date: newDate })));
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-4">
            {slots.map((slot, index) => (
              <div key={index} className="relative grid grid-cols-3 gap-4 items-end bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Attendees
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      value={slot.maxAttendees}
                      onChange={(e) => handleSlotChange(index, 'maxAttendees', parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(index)}
                    className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSlot}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Slot
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Time Slots
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}