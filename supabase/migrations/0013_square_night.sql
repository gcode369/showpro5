/*
  # Fix Open Houses Schema

  1. Changes
    - Drop and recreate open_houses table with proper foreign key relationships
    - Add proper indexes and constraints
    - Update RLS policies
    - Add helper functions for managing attendee counts

  2. Security
    - Enable RLS
    - Add policies for agents and clients
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS open_houses CASCADE;

-- Recreate open houses table with proper relationships
CREATE TABLE open_houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_attendees INTEGER DEFAULT 20,
  current_attendees INTEGER DEFAULT 0,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_times CHECK (start_time < end_time),
  CONSTRAINT valid_attendees CHECK (current_attendees <= max_attendees)
);

-- Enable RLS
ALTER TABLE open_houses ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Agents can manage their own open houses"
  ON open_houses
  FOR ALL
  TO authenticated
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Everyone can view upcoming open houses"
  ON open_houses
  FOR SELECT
  TO authenticated
  USING (date >= CURRENT_DATE);

-- Add function to update attendee count
CREATE OR REPLACE FUNCTION update_open_house_attendees()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE open_houses
  SET current_attendees = (
    SELECT COUNT(*)
    FROM open_house_leads
    WHERE open_house_id = NEW.open_house_id
  )
  WHERE id = NEW.open_house_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for attendee count
CREATE TRIGGER update_attendees_count
  AFTER INSERT OR DELETE ON open_house_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_open_house_attendees();

-- Add indexes for performance
CREATE INDEX idx_open_houses_date ON open_houses(date);
CREATE INDEX idx_open_houses_city ON open_houses(city);
CREATE INDEX idx_open_houses_agent ON open_houses(agent_id);
CREATE INDEX idx_open_houses_property ON open_houses(property_id);