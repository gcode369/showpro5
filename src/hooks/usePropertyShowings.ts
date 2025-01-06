import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { calendarService } from '../services/calendar/CalendarService';
import type { PropertyShowing, ShowingTimeSlot } from '../types/propertyShowing';
import type { Property } from '../types/property';

export function usePropertyShowings(agentId: string) {
  const [showings, setShowings] = useState<PropertyShowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (agentId) {
      fetchShowings();
    }
  }, [agentId]);

  const fetchShowings = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          address,
          property_showings (
            id,
            showing_time_slots (*)
          )
        `)
        .eq('agent_id', agentId);

      if (fetchError) throw fetchError;

      const formattedShowings = (data || []).map(property => ({
        id: property.property_showings?.[0]?.id || '',
        propertyId: property.id,
        property: {
          id: property.id,
          title: property.title,
          address: property.address
        },
        timeSlots: property.property_showings?.[0]?.showing_time_slots || []
      }));

      setShowings(formattedShowings);
    } catch (err) {
      console.error('Error fetching showings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch showings');
    } finally {
      setLoading(false);
    }
  };

  const addPropertyShowing = async (property: Property, timeSlots: Omit<ShowingTimeSlot, 'id'>[]) => {
    try {
      const promises = timeSlots.map(slot => 
        calendarService.createTimeSlot(property.id, slot)
      );
      await Promise.all(promises);
      await fetchShowings();
      return true;
    } catch (err) {
      console.error('Error adding property showing:', err);
      setError(err instanceof Error ? err.message : 'Failed to add showing');
      return false;
    }
  };

  const updateShowingTimeSlots = async (showingId: string, timeSlots: ShowingTimeSlot[]) => {
    try {
      const promises = timeSlots.map(slot => 
        calendarService.updateTimeSlot(slot.id, slot)
      );
      await Promise.all(promises);
      await fetchShowings();
      return true;
    } catch (err) {
      console.error('Error updating time slots:', err);
      setError(err instanceof Error ? err.message : 'Failed to update time slots');
      return false;
    }
  };

  return {
    showings,
    loading,
    error,
    addPropertyShowing,
    updateShowingTimeSlots,
    refreshShowings: fetchShowings
  };
}