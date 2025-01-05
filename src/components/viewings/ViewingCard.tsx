import React from 'react';
import { Clock, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Viewing } from '../../types/viewing';

type ViewingCardProps = {
  viewing: Viewing;
  onCancel: (id: string) => void;
};

export function ViewingCard({ viewing, onCancel }: ViewingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex">
        <div className="w-1/3">
          <img
            src={viewing.propertyImage}
            alt={viewing.propertyTitle}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-2/3 p-4">
          <div className="flex justify-between items-start">
            <div>
              <Link 
                to={`/client/properties/${viewing.propertyId}`}
                className="text-lg font-semibold text-blue-600 hover:text-blue-800"
              >
                {viewing.propertyTitle}
              </Link>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{viewing.propertyAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{viewing.date} at {viewing.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Agent: {viewing.agentName}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onCancel(viewing.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Cancel Viewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}