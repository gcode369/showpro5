import { supabase } from '../supabase';
import type { BookingHistory } from '../../types/booking';

export class BookingHistoryService {
  async getBookingHistory(bookingId: string): Promise<BookingHistory[]> {
    const { data, error } = await supabase
      .from('booking_history')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const bookingHistoryService = new BookingHistoryService();