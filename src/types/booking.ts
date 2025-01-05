export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export type Booking = {
  id: string;
  time_slot_id: string;
  client_id: string;
  agent_id: string;
  property_id: string;
  status: BookingStatus;
  attendees: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type BookingHistory = {
  id: string;
  booking_id: string;
  status: BookingStatus;
  notes?: string;
  created_at: string;
};