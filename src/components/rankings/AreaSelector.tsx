import React from 'react';
import { MapPin } from 'lucide-react';

type AreaSelectorProps = {
  areas: string[];
  selectedArea: string;
  onAreaChange: (area: string) => void;
};

export function AreaSelector({ areas, selectedArea, onAreaChange }: AreaSelectorProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Filter by Area</h3>
      </div>
      
      <select
        value={selectedArea}
        onChange={(e) => onAreaChange(e.target.value)}
        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Areas</option>
        {areas.map(area => (
          <option key={area} value={area}>{area}</option>
        ))}
      </select>
    </div>
  );
}