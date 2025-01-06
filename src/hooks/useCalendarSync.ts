import { useState, useEffect } from 'react';
import { useProperties } from './useProperties';
import { usePropertyShowings } from './usePropertyShowings';
import { calendarService } from '../services/calendar/CalendarService';
import type { ShowingTimeSlot } from '../types/propertyShowing';
import type { Property } from '../types/property';

export function useCalendarSync(agentId?: string) {
  const { properties } = useProperties(agentId);
  const { showings } = usePropertyShowings(agentId || '');
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
      acc[showing.propertyId][slot.date].push({
        ...slot,
        agentId: agentId || ''
      });
    });
    
    return acc;
  }, {} as Record<string, Record<string, ShowingTimeSlot[]>>);

  // Add time slots for a property
  const addTimeSlots = async (propertyId: string, slots: Omit<ShowingTimeSlot, 'id'>[]) => {
    try {
      setError(null);
      const property = properties.find(p => p.id === propertyId);
      if (!property) throw new Error('Property not found');

      // Add time slots using calendar service
      const promises = slots.map(slot => 
        calendarService.createTimeSlot(propertyId, slot)
      );

      await Promise.all(promises);
      return true;
    } catch (err) {
      console.error('Failed to add time slots:', err);
      setError(err instanceof Error ? err.message : 'Failed to add time slots');
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
    addTimeSlots
  };
}