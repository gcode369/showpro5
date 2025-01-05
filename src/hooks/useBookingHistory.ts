import { useState, useEffect } from 'react';
import { bookingHistoryService } from '../services/booking/BookingHistoryService';
import type { BookingHistory } from '../types/booking';

export function useBookingHistory(bookingId: string) {
  const [history, setHistory] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchHistory();
    }
  }, [bookingId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await bookingHistoryService.getBookingHistory(bookingId);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch booking history');
    } finally {
      setLoading(false);
    }
  };

  return {
    history,
    loading,
    error,
    refreshHistory: fetchHistory
  };
}