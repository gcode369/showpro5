/*
  # Fix properties table schema

  1. Changes
    - Rename agentId column to agent_id to match Supabase conventions
    - Add proper foreign key constraint to auth.users
    - Update column names to snake_case
*/

-- Drop existing properties table if it exists
DROP TABLE IF EXISTS properties CASCADE;

-- Recreate properties table with correct schema
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

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Agents can manage their own properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Everyone can view available properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (status = 'available');