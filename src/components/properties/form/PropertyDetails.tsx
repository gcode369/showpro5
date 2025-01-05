import React from 'react';
import { DollarSign } from 'lucide-react';
import type { Property } from '../../../types/property';

type PropertyDetailsProps = {
  data: Partial<Property>;
  onChange: (name: string, value: string | number) => void;
};

export function PropertyDetails({ data, onChange }: PropertyDetailsProps) {
  const formatPrice = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Convert to number and format with commas
    return digits ? parseInt(digits).toLocaleString() : '';
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value);
    const numericValue = parseInt(e.target.value.replace(/\D/g, '')) || 0;
    e.target.value = formatted;
    onChange('price', numericValue);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Property Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={data.price ? data.price.toLocaleString() : ''}
              onChange={handlePriceChange}
              placeholder="Enter price"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {data.category === 'residential' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                value={data.bedrooms || ''}
                onChange={(e) => onChange('bedrooms', Number(e.target.value))}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                value={data.bathrooms || ''}
                onChange={(e) => onChange('bathrooms', Number(e.target.value))}
                min="0"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Square Feet
          </label>
          <input
            type="number"
            value={data.squareFeet || ''}
            onChange={(e) => onChange('squareFeet', Number(e.target.value))}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the property..."
          />
        </div>
      </div>
    </div>
  );
}