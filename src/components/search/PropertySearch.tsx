import { useState } from 'react';
import { Search, MapPin, Building2 } from 'lucide-react';
import { Button } from '../common/Button';
import { BC_CITIES } from '../../constants/locations';
import { useProperties } from '../../hooks/useProperties';
import type { PropertyCategory } from '../../types/property';

const PROPERTY_CATEGORIES: Record<PropertyCategory, string> = {
  residential: 'Residential',
  commercial: 'Commercial'
};

const PROPERTY_TYPES = {
  residential: ['house', 'condo', 'townhouse', 'apartment'],
  commercial: ['office', 'retail', 'industrial', 'warehouse']
};

export function PropertySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>('residential');
  const [selectedType, setSelectedType] = useState<string>('');
  const { properties } = useProperties();

  const filteredProperties = properties.filter(property => {
    const matchesQuery = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = !selectedArea || property.city === selectedArea;
    const matchesCategory = !selectedCategory || property.category === selectedCategory;
    const matchesType = !selectedType || property.type === selectedType;
    
    return matchesQuery && matchesArea && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location or property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Areas</option>
              {BC_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value as PropertyCategory);
              setSelectedType(''); // Reset type when category changes
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(PROPERTY_CATEGORIES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES[selectedCategory].map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map(property => (
          <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  {property.category.charAt(0).toUpperCase() + property.category.slice(1)} • {
                    property.type.charAt(0).toUpperCase() + property.type.slice(1)
                  }
                </span>
              </div>
              <h3 className="text-lg font-semibold">{property.title}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{property.address}</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${property.price.toLocaleString()}
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Button>View Details</Button>
                <Button variant="outline">Book Viewing</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}