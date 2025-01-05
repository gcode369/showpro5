import { useState, useEffect } from 'react';
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

  const createOpenHouse = async (data: Omit<OpenHouse, 'id' | 'agentName' | 'attendees'>) => {
    try {
      setError(null);
      const newOpenHouse = await openHouseService.createOpenHouse(data);
      setOpenHouses(prev => [...prev, newOpenHouse]);
      return newOpenHouse;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create open house';
      setError(message);
      throw new Error(message);
    }
  };

  const registerForOpenHouse = async (openHouseId: string, attendeeData: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
    interestedInSimilar: boolean;
    prequalified: boolean;
  }) => {
    try {
      setError(null);
      await openHouseService.registerAttendee(openHouseId, attendeeData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to register for open house';
      setError(message);
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchOpenHouses();
  }, []);

  return {
    openHouses,
    loading,
    error,
    createOpenHouse,
    registerForOpenHouse,
    refreshOpenHouses: fetchOpenHouses
  };
}