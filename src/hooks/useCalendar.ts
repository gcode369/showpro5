import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendar/CalendarService';
import type { ShowingTimeSlot } from '../types/propertyShowing';

export function useCalendar(propertyId: string) {
  const [timeSlots, setTimeSlots] = useState<ShowingTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propertyId) {
      fetchTimeSlots();
    }
  }, [propertyId]);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const slots = await calendarService.getTimeSlots(propertyId);
      setTimeSlots(slots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch time slots');
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = async (data: Omit<ShowingTimeSlot, 'id'>) => {
    try {
      const newSlot = await calendarService.createTimeSlot(propertyId, data);
      setTimeSlots(prev => [...prev, newSlot]);
      return newSlot;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add time slot');
      throw err;
    }
  };

  const updateTimeSlot = async (slotId: string, updates: Partial<ShowingTimeSlot>) => {
    try {
      const updatedSlot = await calendarService.updateTimeSlot(slotId, updates);
      setTimeSlots(prev => prev.map(slot => 
        slot.id === slotId ? updatedSlot : slot
      ));
      return updatedSlot;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update time slot');
      throw err;
    }
  };

  return {
    timeSlots,
    loading,
    error,
    addTimeSlot,
    updateTimeSlot,
    refreshTimeSlots: fetchTimeSlots
  };
}