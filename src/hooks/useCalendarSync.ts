import { useState, useEffect } from 'react';
import { useProperties } from './useProperties';
import { usePropertyShowings } from './usePropertyShowings';
import type { ShowingTimeSlot } from '../types/propertyShowing';

export function useCalendarSync(agentId?: string) {
  const { properties } = useProperties(agentId);
  const { showings, addPropertyShowing, updateShowingTimeSlots } = usePropertyShowings(agentId || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Group time slots by property and date
  const timeSlotsByProperty = showings.reduce((acc, showing) => {
    if (!acc[showing.propertyId]) {
      acc[showing.propertyId] = {};
    }
    
    showing.timeSlots.forEach(slot => {
      if (!acc[showing.propertyId][slot.date]) {
        acc[showing.propertyId][slot.date] = [];
      }
      // Ensure agentId is included in each time slot
      const slotWithAgent: ShowingTimeSlot = {
        ...slot,
        agentId: agentId || ''
      };
      acc[showing.propertyId][slot.date].push(slotWithAgent);
    });
    
    return acc;
  }, {} as Record<string, Record<string, ShowingTimeSlot[]>>);

  // Add time slots for a property
  const addTimeSlots = async (propertyId: string, slots: Omit<ShowingTimeSlot, 'id'>[]) => {
    try {
      setError(null);
      const property = properties.find(p => p.id === propertyId);
      if (!property) throw new Error('Property not found');

      // Ensure agentId is included in new slots
      const slotsWithAgent = slots.map(slot => ({
        ...slot,
        agentId: agentId || ''
      }));

      await addPropertyShowing(property, slotsWithAgent);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add time slots');
      return false;
    }
  };

  // Update existing time slots
  const updateTimeSlots = async (showingId: string, slots: ShowingTimeSlot[]) => {
    try {
      setError(null);
      // Ensure agentId is preserved in updated slots
      const updatedSlots = slots.map(slot => ({
        ...slot,
        agentId: slot.agentId || agentId || ''
      }));
      await updateShowingTimeSlots(showingId, updatedSlots);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update time slots');
      return false;
    }
  };

  useEffect(() => {
    if (properties.length > 0 || showings.length > 0) {
      setLoading(false);
    }
  }, [properties, showings]);

  return {
    properties,
    timeSlotsByProperty,
    loading,
    error,
    addTimeSlots,
    updateTimeSlots
  };
}