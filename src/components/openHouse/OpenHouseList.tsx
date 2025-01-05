import React from 'react';
import { Calendar, MapPin, Users, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { OpenHouseCard } from './OpenHouseCard';
import { useOpenHouses } from '../../hooks/useOpenHouses';

export function OpenHouseList() {
  const { openHouses, deleteOpenHouse } = useOpenHouses();

  if (openHouses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-lg">
        <p className="text-gray-600">You haven't published any open houses yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {openHouses.map((openHouse) => (
        <OpenHouseCard
          key={openHouse.id}
          openHouse={openHouse}
          onDelete={deleteOpenHouse}
        />
      ))}
    </div>
  );
}