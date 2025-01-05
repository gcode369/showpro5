import React from 'react';
import { Clock, Users, X } from 'lucide-react';

type TimeSlotFormProps = {
  startTime: string;
  endTime: string;
  maxAttendees: number;
  onChange: (field: string, value: string | number) => void;
  onRemove?: () => void;
};

export function TimeSlotForm({ startTime, endTime, maxAttendees, onChange, onRemove }: TimeSlotFormProps) {
  return (
    <div className="relative grid grid-cols-3 gap-4 items-end bg-gray-50 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Time
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="time"
            value={startTime}
            onChange={(e) => onChange('startTime', e.target.value)}
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
            value={endTime}
            onChange={(e) => onChange('endTime', e.target.value)}
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
            value={maxAttendees}
            onChange={(e) => onChange('maxAttendees', parseInt(e.target.value))}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-500 hover:text-red-500"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}