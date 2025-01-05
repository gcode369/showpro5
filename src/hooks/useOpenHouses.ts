import { useState } from 'react';
import { OpenHouse } from '../types/openHouse';

const mockOpenHouses: OpenHouse[] = [
  {
    id: '1',
    propertyId: 'prop1',
    date: '2024-03-25',
    startTime: '14:00',
    endTime: '16:00',
    agentId: 'agent1',
    agentName: 'John Doe',
    address: '123 Main Street',
    city: 'Vancouver',
    province: 'BC',
    postalCode: 'V6B 2W2',
    attendees: [],
    maxAttendees: 20,
    listingUrl: 'https://example.com/listing/123'
  }
];

export function useOpenHouses() {
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>(mockOpenHouses);

  const deleteOpenHouse = (id: string) => {
    setOpenHouses(prev => prev.filter(oh => oh.id !== id));
  };

  return {
    openHouses,
    deleteOpenHouse
  };
}