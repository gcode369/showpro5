import React from 'react';
import { Clock, MapPin, User, Phone, Mail } from 'lucide-react';
import type { Appointment } from '../../types/appointment';

type AppointmentListProps = {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
};

export function AppointmentList({ appointments, onUpdateStatus }: AppointmentListProps) {
  const sortedAppointments = [...appointments].sort((a, b) => 
    `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)
  );

  return (
    <div className="space-y-4">
      {sortedAppointments.map((appointment) => (
        <div
          key={appointment.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">
                  {appointment.type === 'showing' ? 'Property Showing' :
                   appointment.type === 'meeting' ? 'Client Meeting' : 'Open House'}
                </h3>
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'}
                `}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>

              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.date} | {appointment.startTime} - {appointment.endTime}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{appointment.clientName}</span>
                </div>

                {appointment.clientPhone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${appointment.clientPhone}`} className="hover:text-blue-600">
                      {appointment.clientPhone}
                    </a>
                  </div>
                )}

                {appointment.clientEmail && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${appointment.clientEmail}`} className="hover:text-blue-600">
                      {appointment.clientEmail}
                    </a>
                  </div>
                )}

                {appointment.propertyAddress && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{appointment.propertyAddress}</span>
                  </div>
                )}

                {appointment.notes && (
                  <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                )}
              </div>
            </div>

            {appointment.status === 'scheduled' && (
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateStatus(appointment.id, 'completed')}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Complete
                </button>
                <button
                  onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}