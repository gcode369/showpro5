import React from 'react';
import { MapPin } from 'lucide-react';

type AreaSelectorProps = {
  areas: readonly string[];
  selectedArea: string;
  onAreaChange: (area: string) => void;
  className?: string;
};

export function AreaSelector({ areas, selectedArea, onAreaChange, className }: AreaSelectorProps) {
  return (
    <div className={`relative ${className}`}>
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <select
        value={selectedArea}
        onChange={(e) => onAreaChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
      >
        <option value="">All Areas</option>
        {areas.map(area => (
          <option key={area} value={area}>{area}</option>
        ))}
      </select>
    </div>
  );
}