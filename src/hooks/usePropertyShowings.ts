import { useState } from 'react';
import type { PropertyShowing, ShowingTimeSlot } from '../types/propertyShowing';
import type { Property } from '../types/property';

export function usePropertyShowings(agentId: string) {
  const [showings, setShowings] = useState<PropertyShowing[]>([]);

  const addPropertyShowing = async (property: Property, timeSlots: Omit<ShowingTimeSlot, 'id'>[]) => {
    const newShowing: PropertyShowing = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId: property.id,
      property: {
        id: property.id,
        title: property.title,
        address: property.address
      },
      timeSlots: timeSlots.map(slot => ({
        ...slot,
        id: Math.random().toString(36).substr(2, 9),
        propertyId: property.id,
        agentId,
        isBooked: false,
        currentAttendees: 0
      }))
    };

    setShowings(prev => [...prev, newShowing]);
    return newShowing;
  };

  const updateShowingTimeSlots = (showingId: string, timeSlots: ShowingTimeSlot[]) => {
    setShowings(prev => prev.map(showing =>
      showing.id === showingId ? { ...showing, timeSlots } : showing
    ));
  };

  const removePropertyShowing = (showingId: string) => {
    setShowings(prev => prev.filter(showing => showing.id !== showingId));
  };

  return {
    showings,
    addPropertyShowing,
    updateShowingTimeSlots,
    removePropertyShowing
  };
}