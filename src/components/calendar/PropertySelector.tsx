import React from 'react';
import { Building2 } from 'lucide-react';
import type { Property } from '../../types/property';

type PropertySelectorProps = {
  properties: Property[];
  selectedProperty: Property | null;
  onSelect: (property: Property | null) => void;
};

export function PropertySelector({
  properties,
  selectedProperty,
  onSelect
}: PropertySelectorProps) {
  if (properties.length === 0) {
    return (
      <div className="text-gray-500 flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        <span>No properties available</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Building2 className="w-5 h-5 text-gray-400" />
      <select
        value={selectedProperty?.id || ''}
        onChange={(e) => {
          const property = properties.find(p => p.id === e.target.value);
          onSelect(property || null);
        }}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select a property</option>
        {properties.map(property => (
          <option key={property.id} value={property.id}>
            {property.title}
          </option>
        ))}
      </select>
    </div>
  );
}