import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import { Event } from '../../types/event';

type EventCardProps = {
  event: Event;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
};

export function EventCard({ event, onEdit, onCancel }: EventCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{event.clients.join(', ')}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(event.id)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button 
            onClick={() => onCancel(event.id)}
            className="text-red-600 hover:text-red-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}