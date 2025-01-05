import { type FC } from 'react';
import { MapPin } from 'lucide-react';
import { BC_CITIES } from '../../../constants/locations';
import type { Property } from '../../../types/property';

type PropertyLocationProps = {
  data: Partial<Property>;
  onChange: (name: string, value: string) => void;
};

export const PropertyLocation: FC<PropertyLocationProps> = ({ data, onChange }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="address"
              value={data.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter street address"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            name="city"
            value={data.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select City</option>
            {BC_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};