import { useState, useEffect } from 'react';
import { bookingService } from '../services/booking/BookingService';
import type { Booking } from '../types/booking';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (data: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const booking = await bookingService.createBooking(data);
      setBookings(prev => [...prev, booking]);
      return booking;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      throw err;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const updatedBooking = await bookingService.updateBookingStatus(bookingId, status);
      setBookings(prev => prev.map(booking =>
        booking.id === bookingId ? updatedBooking : booking
      ));
      return updatedBooking;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking status');
      throw err;
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus
  };
}