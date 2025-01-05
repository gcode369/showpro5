import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { TimeSlotForm } from './TimeSlotForm';
import type { ShowingTimeSlot } from '../../types/propertyShowing';

type ShowingTimeSlotModalProps = {
  propertyId: string;
  onClose: () => void;
  onAdd: (slots: Omit<ShowingTimeSlot, 'id'>[]) => Promise<void>;
};

export function ShowingTimeSlotModal({ propertyId, onClose, onAdd }: ShowingTimeSlotModalProps) {
  const [slots, setSlots] = useState<Omit<ShowingTimeSlot, 'id'>[]>([
    {
      propertyId,
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      isBooked: false,
      maxAttendees: 1,
      currentAttendees: 0
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(slots);
    onClose();
  };

  const handleAddSlot = () => {
    const lastSlot = slots[slots.length - 1];
    const [hours, minutes] = lastSlot.endTime.split(':');
    const nextStart = lastSlot.endTime;
    const nextEnd = `${String(Number(hours) + 1).padStart(2, '0')}:${minutes}`;

    setSlots([
      ...slots,
      {
        propertyId,
        date: lastSlot.date,
        startTime: nextStart,
        endTime: nextEnd,
        isBooked: false,
        maxAttendees: 1,
        currentAttendees: 0
      }
    ]);
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index: number, field: string, value: string | number) => {
    setSlots(slots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
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
            />
          </div>

          <div className="space-y-4">
            {slots.map((slot, index) => (
              <TimeSlotForm
                key={index}
                startTime={slot.startTime}
                endTime={slot.endTime}
                maxAttendees={slot.maxAttendees}
                onChange={(field, value) => handleSlotChange(index, field, value)}
                onRemove={slots.length > 1 ? () => handleRemoveSlot(index) : undefined}
              />
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