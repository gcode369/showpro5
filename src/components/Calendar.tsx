import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';

type Event = {
  id: string;
  title: string;
  time: string;
  location: string;
  clients: string[];
};

const mockEvents: Event[] = [
  {
    id: '1',
    title: '123 Maple Street Showing',
    time: '10:00 AM',
    location: '123 Maple Street',
    clients: ['John & Sarah Smith'],
  },
  {
    id: '2',
    title: '456 Oak Avenue Showing',
    time: '2:00 PM',
    location: '456 Oak Avenue',
    clients: ['Michael Johnson'],
  },
];

export function Calendar() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Today's Schedule</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <CalendarIcon className="w-4 h-4" />
          New Showing
        </button>
      </div>
      
      <div className="space-y-4">
        {mockEvents.map((event) => (
          <div
            key={event.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
          >
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
                <button className="text-blue-600 hover:text-blue-800">Edit</button>
                <button className="text-red-600 hover:text-red-800">Cancel</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}