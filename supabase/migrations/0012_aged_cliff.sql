/*
  # Add Open Houses Table

  1. New Tables
    - `open_houses`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `agent_id` (uuid, references auth.users)
      - `date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `max_attendees` (integer)
      - `address` (text)
      - `city` (text)
      - `province` (text)
      - `postal_code` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `open_houses` table
    - Add policies for agents and clients
*/

-- Create open houses table
CREATE TABLE open_houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  agent_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_attendees INTEGER DEFAULT 20,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
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

CREATE POLICY "Everyone can view open houses"
  ON open_houses
  FOR SELECT
  TO authenticated
  USING (date >= CURRENT_DATE);

-- Add trigger for updated_at
CREATE TRIGGER update_open_houses_updated_at
  BEFORE UPDATE ON open_houses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Add indexes
CREATE INDEX idx_open_houses_date ON open_houses(date);
CREATE INDEX idx_open_houses_city ON open_houses(city);
CREATE INDEX idx_open_houses_agent ON open_houses(agent_id);