import { useState } from 'react';
import { openHouseService } from '../services/openHouse/OpenHouseService';
import type { OpenHouse } from '../types/openHouse';

export function useOpenHouse() {
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpenHouses = async (filters?: { city?: string; date?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await openHouseService.getOpenHouses(filters);
      setOpenHouses(data);
    } catch (err) {
      console.error('Error fetching open houses:', err);
      setError('Failed to fetch open houses');
    } finally {
      setLoading(false);
    }
  };

  const createOpenHouse = async (data: Omit<OpenHouse, 'id' | 'currentAttendees'>) => {
    try {
      setLoading(true);
      setError(null);
      const newOpenHouse = await openHouseService.createOpenHouse(data);
      setOpenHouses(prev => [...prev, newOpenHouse]);
      setLoading(false);
      return newOpenHouse;
    } catch (err) {
      console.error('Error creating open house:', err);
      setError('Failed to create open house');
      setLoading(false);
      throw err;
    }
  };

  return {
    openHouses,
    loading,
    error,
    fetchOpenHouses,
    createOpenHouse
  };
}