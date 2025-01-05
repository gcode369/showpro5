/*
  # Properties and Showings Schema

  1. New Tables
    - properties
      - Basic property information
      - Linked to agent
      - Includes all necessary fields for listings
    - property_showings
      - Manages showing schedules for properties
      - Tracks time slots and bookings
    - showing_time_slots
      - Individual time slots for property showings
      - Handles availability and booking status

  2. Security
    - RLS policies for proper access control
    - Agents can only manage their own properties
    - Clients can view available properties and book showings
*/

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  price DECIMAL NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  agent_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('available', 'pending', 'sold')),
  category TEXT NOT NULL CHECK (category IN ('residential', 'commercial')),
  type TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  bedrooms INTEGER,
  bathrooms DECIMAL,
  square_feet INTEGER,
  listing_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Property showings table
CREATE TABLE property_showings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  notes TEXT,
  showing_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Time slots table
CREATE TABLE showing_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showing_id UUID NOT NULL REFERENCES property_showings(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  max_attendees INTEGER DEFAULT 1,
  current_attendees INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_showings ENABLE ROW LEVEL SECURITY;
ALTER TABLE showing_time_slots ENABLE ROW LEVEL SECURITY;

-- Policies for properties
CREATE POLICY "Agents can manage their own properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Everyone can view available properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (status = 'available');

-- Policies for property showings
CREATE POLICY "Agents can manage their property showings"
  ON property_showings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.agent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.agent_id = auth.uid()
    )
  );

CREATE POLICY "Everyone can view property showings"
  ON property_showings
  FOR SELECT
  TO authenticated;

-- Policies for time slots
CREATE POLICY "Agents can manage their showing time slots"
  ON showing_time_slots
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM property_showings
      JOIN properties ON property_showings.property_id = properties.id
      WHERE showing_time_slots.showing_id = property_showings.id
      AND properties.agent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM property_showings
      JOIN properties ON property_showings.property_id = properties.id
      WHERE showing_time_slots.showing_id = property_showings.id
      AND properties.agent_id = auth.uid()
    )
  );

CREATE POLICY "Everyone can view time slots"
  ON showing_time_slots
  FOR SELECT
  TO authenticated;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_property_showings_updated_at
  BEFORE UPDATE ON property_showings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();