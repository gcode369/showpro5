/*
  # Fix booking system and add missing tables

  1. Changes
    - Add missing indexes for bookings
    - Add booking notifications trigger
    - Add booking status history

  2. Security
    - Add RLS policies for new tables
    - Add row-level security for booking history
*/

-- Add booking history table
CREATE TABLE booking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add trigger for booking status changes
CREATE OR REPLACE FUNCTION record_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS NULL OR NEW.status != OLD.status THEN
    INSERT INTO booking_history (booking_id, status, notes)
    VALUES (NEW.id, NEW.status, NEW.notes);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_status_change
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION record_booking_status_change();

-- Add notification trigger for bookings
CREATE OR REPLACE FUNCTION create_booking_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify agent of new booking
  IF TG_OP = 'INSERT' THEN
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
      NEW.agent_id,
      'booking_request',
      'New Booking Request',
      'You have a new booking request'
    );
  -- Notify client of status change
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
      NEW.client_id,
      CASE 
        WHEN NEW.status = 'confirmed' THEN 'booking_confirmed'
        WHEN NEW.status = 'cancelled' THEN 'booking_cancelled'
        ELSE 'system'
      END,
      CASE 
        WHEN NEW.status = 'confirmed' THEN 'Booking Confirmed'
        WHEN NEW.status = 'cancelled' THEN 'Booking Cancelled'
        ELSE 'Booking Status Updated'
      END,
      'Your booking status has been updated to ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_notification
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_booking_notification();

-- Enable RLS on booking_history
ALTER TABLE booking_history ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for booking_history
CREATE POLICY "Users can view their own booking history"
  ON booking_history
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = booking_history.booking_id
    AND (bookings.client_id = auth.uid() OR bookings.agent_id = auth.uid())
  ));

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_bookings_time_slot_id ON bookings(time_slot_id);
CREATE INDEX IF NOT EXISTS idx_booking_history_booking_id ON booking_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_history_created_at ON booking_history(created_at);