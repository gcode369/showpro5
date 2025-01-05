import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useOpenHouse } from '../../hooks/useOpenHouse';
import { RegistrationModal } from '../../components/openHouse/RegistrationModal';
import { BC_CITIES } from '../../constants/locations';

export function ClientOpenHousesPage() {
  const { openHouses, loading, error, registerForOpenHouse } = useOpenHouse();
  const [selectedOpenHouse, setSelectedOpenHouse] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState('');

  const filteredOpenHouses = cityFilter
    ? openHouses.filter(oh => oh.city === cityFilter)
    : openHouses;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Open Houses</h1>
        <p className="text-gray-600 mt-2">Browse and register for upcoming open houses</p>
      </header>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {BC_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredOpenHouses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600">No open houses available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpenHouses.map((openHouse) => (
            <div key={openHouse.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <img
                src={openHouse.property.images[0]}
                alt={openHouse.property.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{openHouse.property.title}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{openHouse.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>{openHouse.date}</span>
                    <span>•</span>
                    <span>{openHouse.startTime} - {openHouse.endTime}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOpenHouse(openHouse.id)}
                  className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOpenHouse && (
        <RegistrationModal
          openHouseId={selectedOpenHouse}
          onClose={() => setSelectedOpenHouse(null)}
          onSubmit={registerForOpenHouse}
        />
      )}
    </>
  );
}