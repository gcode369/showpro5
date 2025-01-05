import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '../common/Button';
import { ClientModal } from './ClientModal';
import type { Client } from '../../types/client';

type ClientListProps = {
  clients: Client[];
  onUpdate: (id: string, updates: Partial<Client>) => void;
  onDelete: (id: string) => void;
};

export function ClientList({ clients, onUpdate, onDelete }: ClientListProps) {
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'lead':
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="divide-y divide-gray-100">
      {clients.map((client) => (
        <div key={client.id} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {client.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </span>
                {client.source !== 'manual' && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    Via {client.source === 'booking' ? 'Booking' : 'Open House'}
                  </span>
                )}
              </div>

              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${client.email}`} className="hover:text-blue-600">
                    {client.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${client.phone}`} className="hover:text-blue-600">
                    {client.phone}
                  </a>
                </div>
                {client.areasOfInterest.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{client.areasOfInterest.join(', ')}</span>
                  </div>
                )}
                {client.lastContact && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Last Contact: {new Date(client.lastContact).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {client.notes && (
                <p className="mt-2 text-sm text-gray-600">{client.notes}</p>
              )}

              {client.viewings.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Viewings</h4>
                  <div className="space-y-2">
                    {client.viewings.slice(0, 3).map((viewing, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{viewing.propertyAddress}</span>
                        <span>•</span>
                        <span>{new Date(viewing.date).toLocaleDateString()}</span>
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-medium
                          ${viewing.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            viewing.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'}
                        `}>
                          {viewing.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingClient(client)}
                className="flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => onDelete(client.id)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}

      {editingClient && (
        <ClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onSubmit={(updates) => {
            onUpdate(editingClient.id, updates);
            setEditingClient(null);
          }}
        />
      )}
    </div>
  );
}