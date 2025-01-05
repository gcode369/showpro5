import React, { useState } from 'react';
import { MapPin, Home, DollarSign, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '../common/Button';
import { PropertyModal } from './PropertyModal';
import type { Property } from '../../types/property';

type PropertyListProps = {
  properties: Property[];
  onUpdate: (id: string, updates: Partial<Property>) => void;
  onDelete: (id: string) => void;
};

export function PropertyList({ properties, onUpdate, onDelete }: PropertyListProps) {
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const getStatusBadgeColor = (status: Property['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {properties.map((property) => (
        <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{property.title}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusBadgeColor(property.status)}`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </span>
              </div>
              <div className="text-xl font-bold text-blue-600">
                ${property.price.toLocaleString()}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{property.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Home className="w-4 h-4" />
                <span>
                  {property.bedrooms} beds • {property.bathrooms} baths • {property.squareFeet} sqft
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingProperty(property)}
                  className="flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onDelete(property.id)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
              {property.listingUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(property.listingUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Listing
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {editingProperty && (
        <PropertyModal
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
          onSubmit={(updates) => {
            onUpdate(editingProperty.id, updates);
            setEditingProperty(null);
          }}
        />
      )}
    </div>
  );
}