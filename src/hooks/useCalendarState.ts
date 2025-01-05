import { useState } from 'react';
import { useCalendar } from './useCalendar';
import { useBookings } from './useBookings';
import { useAuthStore } from '../store/authStore';
import type { ShowingTimeSlot } from '../types/propertyShowing';

export function useCalendarState(propertyId: string) {
  const { user } = useAuthStore();
  const { timeSlots, loading, error, addTimeSlot, updateTimeSlot } = useCalendar(propertyId);
  const { createBooking } = useBookings();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ShowingTimeSlot | null>(null);

  // Group time slots by date
  const slotsByDate = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, ShowingTimeSlot[]>);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: ShowingTimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBookSlot = async (attendees: number, notes?: string) => {
    if (!user || !selectedSlot) return false;

    try {
      await createBooking({
        time_slot_id: selectedSlot.id,
        property_id: propertyId,
        client_id: user.id,
        agent_id: selectedSlot.agentId,
        attendees,
        notes,
        status: 'pending'
      });

      // Update the slot's status
      await updateTimeSlot(selectedSlot.id, {
        ...selectedSlot,
        isBooked: true,
        currentAttendees: (selectedSlot.currentAttendees || 0) + attendees
      });

      setSelectedSlot(null);
      return true;
    } catch (err) {
      console.error('Failed to book slot:', err);
      return false;
    }
  };

  return {
    slotsByDate,
    selectedDate,
    selectedSlot,
    loading,
    error,
    handleDateSelect,
    handleSlotSelect,
    handleBookSlot,
    addTimeSlot,
    updateTimeSlot
  };
}