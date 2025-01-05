import { useState } from 'react';
import { AgentAvailability } from '../types/availability';

const initialAvailability: AgentAvailability = {
  agentId: '1', // This would come from auth context in a real app
  schedule: [],
  defaultHours: {
    start: '09:00',
    end: '17:00',
    daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
  }
};

export function useAgentAvailability() {
  const [availability, setAvailability] = useState<AgentAvailability>(initialAvailability);

  const updateAvailability = (newAvailability: AgentAvailability) => {
    setAvailability(newAvailability);
    // TODO: Sync with backend
  };

  return {
    availability,
    updateAvailability
  };
}