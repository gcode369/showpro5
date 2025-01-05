import React from 'react';
import { Building2 } from 'lucide-react';
import type { Property, PropertyCategory } from '../../../types/property';

type PropertyBasicInfoProps = {
  data: Partial<Property>;
  onChange: (name: string, value: string | PropertyCategory) => void;
};

export function PropertyBasicInfo({ data, onChange }: PropertyBasicInfoProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Title
          </label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={(e) => onChange('title', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Modern Downtown Condo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Category
          </label>
          <select
            name="category"
            value={data.category}
            onChange={(e) => onChange('category', e.target.value as PropertyCategory)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            name="type"
            value={data.type}
            onChange={(e) => onChange('type', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {data.category === 'residential' ? (
              <>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="apartment">Apartment</option>
              </>
            ) : (
              <>
                <option value="office">Office</option>
                <option value="retail">Retail</option>
                <option value="industrial">Industrial</option>
                <option value="warehouse">Warehouse</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={data.status}
            onChange={(e) => onChange('status', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>
    </div>
  );
}