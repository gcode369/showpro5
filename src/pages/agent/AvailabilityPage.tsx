import React from 'react';
import { AvailabilityCalendar } from '../../components/calendar/AvailabilityCalendar';
import { AgentAvailability } from '../../types/availability';
import { useAgentAvailability } from '../../hooks/useAgentAvailability';

export function AvailabilityPage() {
  const { availability, updateAvailability } = useAgentAvailability();

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Availability</h1>
        <p className="text-gray-600 mt-2">Set your available time slots for property showings</p>
      </header>

      <AvailabilityCalendar
        availability={availability}
        onUpdate={updateAvailability}
      />
    </>
  );
}