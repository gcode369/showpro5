import { useState } from 'react';
import type { PropertyShowing, ShowingTimeSlot } from '../types/propertyShowing';
import type { Property } from '../types/property';

export function usePropertyShowings(agentId: string) {
  const [showings, setShowings] = useState<PropertyShowing[]>([]);

  const addPropertyShowing = (property: Property, timeSlots: Omit<ShowingTimeSlot, 'id'>[]) => {
    const newShowing: PropertyShowing = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId: property.id,
      property,
      timeSlots: timeSlots.map(slot => ({
        ...slot,
        id: Math.random().toString(36).substr(2, 9),
        isBooked: false,
        currentAttendees: 0
      }))
    };
    setShowings(prev => [...prev, newShowing]);
    return newShowing;
  };

  const updateShowingTimeSlots = (showingId: string, timeSlots: ShowingTimeSlot[]) => {
    setShowings(prev => prev.map(showing =>
      showing.id === showingId
        ? { ...showing, timeSlots }
        : showing
    ));
  };

  const removePropertyShowing = (showingId: string) => {
    setShowings(prev => prev.filter(showing => showing.id !== showingId));
  };

  const getShowingsByProperty = (propertyId: string) => {
    return showings.find(showing => showing.propertyId === propertyId);
  };

  const getAvailableTimeSlots = (propertyId: string, date: string) => {
    const showing = getShowingsByProperty(propertyId);
    return showing?.timeSlots.filter(slot => 
      slot.date === date && !slot.isBooked
    ) || [];
  };

  return {
    showings,
    addPropertyShowing,
    updateShowingTimeSlots,
    removePropertyShowing,
    getShowingsByProperty,
    getAvailableTimeSlots
  };
}