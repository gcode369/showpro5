import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { openHouseService } from '../services/openHouse/OpenHouseService';
import type { OpenHouse } from '../types/openHouse';

export function useOpenHouseForm() {
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: Omit<OpenHouse, 'id' | 'agentId' | 'agentName' | 'attendees'>) => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const openHouseData = {
        ...formData,
        agentId: user.id,
        agentName: user.name
      };

      await openHouseService.createOpenHouse(openHouseData);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Open house creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create open house');
      setLoading(false);
      return false;
    }
  };

  return { handleSubmit, loading, error };
}