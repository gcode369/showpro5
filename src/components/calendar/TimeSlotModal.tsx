import React, { useState } from 'react';
import { X, Clock, Users, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import type { Property } from '../../types/property';
import type { ShowingTimeSlot } from '../../types/propertyShowing';

type TimeSlotModalProps = {
  property: Property;
  timeSlot: ShowingTimeSlot | null;
  onClose: () => void;
  onSave: (timeSlot: Omit<ShowingTimeSlot, 'id'>) => void;
  onDelete?: () => void;
};

export function TimeSlotModal({
  property,
  timeSlot,
  onClose,
  onSave,
  onDelete
}: TimeSlotModalProps) {
  const [formData, setFormData] = useState<Omit<ShowingTimeSlot, 'id'>>({
    propertyId: property.id,
    date: timeSlot?.date || new Date().toISOString().split('T')[0],
    startTime: timeSlot?.startTime || '09:00',
    endTime: timeSlot?.endTime || '10:00',
    isBooked: timeSlot?.isBooked || false,
    maxAttendees: timeSlot?.maxAttendees || 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              {timeSlot ? 'Edit Time Slot' : 'Add Time Slot'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Attendees
            </label>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <input
                type="number"
                min="1"
                value={formData.maxAttendees}
                onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) }))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <div>
              {onDelete && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Slot
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {timeSlot ? 'Update' : 'Add'} Time Slot
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}