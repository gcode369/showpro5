import { useState } from 'react';
import { openHouseService } from '../services/openHouse/OpenHouseService';
import type { OpenHouse } from '../types/openHouse';

export function useOpenHouse() {
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpenHouses = async (filters?: { city?: string; date?: string }) => {
    try {
      setError(null);
      setLoading(true);
      const data = await openHouseService.getOpenHouses(filters);
      setOpenHouses(data);
    } catch (err) {
      console.error('Error in useOpenHouse:', err);
      setError('Failed to fetch open houses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const createOpenHouse = async (data: Omit<OpenHouse, 'id' | 'currentAttendees'>) => {
    try {
      setError(null);
      const newOpenHouse = await openHouseService.createOpenHouse(data);
      setOpenHouses(prev => [...prev, newOpenHouse]);
      return newOpenHouse;
    } catch (err) {
      console.error('Create open house error:', err);
      setError('Failed to create open house');
      throw err;
    }
  };

  const registerForOpenHouse = async (openHouseId: string, data: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
    interestedInSimilar: boolean;
    prequalified: boolean;
  }) => {
    try {
      setError(null);
      await openHouseService.registerAttendee(openHouseId, data);
      await fetchOpenHouses(); // Refresh the list to update attendee count
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register for open house');
      throw err;
    }
  };

  return {
    openHouses,
    loading,
    error,
    fetchOpenHouses,
    createOpenHouse,
    registerForOpenHouse
  };
}