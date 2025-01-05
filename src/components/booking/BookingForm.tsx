import React, { useState } from 'react';
import { Calendar, Clock, Users, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import type { ShowingTimeSlot } from '../../types/propertyShowing';

type BookingFormProps = {
  timeSlot: ShowingTimeSlot;
  maxAttendees: number;
  onSubmit: (data: {
    attendees: number;
    notes: string;
  }) => void;
  onCancel: () => void;
};

export function BookingForm({
  timeSlot,
  maxAttendees,
  onSubmit,
  onCancel
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    attendees: 1,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Confirm Showing Details</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>{new Date(timeSlot.date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>{timeSlot.startTime} - {timeSlot.endTime}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Attendees
        </label>
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-gray-400" />
          <input
            type="number"
            min="1"
            max={maxAttendees}
            value={formData.attendees}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              attendees: parseInt(e.target.value)
            }))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-500">
            Max {maxAttendees} attendees
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <div className="flex gap-3">
          <FileText className="w-5 h-5 text-gray-400" />
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              notes: e.target.value
            }))}
            rows={3}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any special requests or questions..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Confirm Booking
        </Button>
      </div>
    </form>
  );
}