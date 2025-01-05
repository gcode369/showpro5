/*
  # Add Profiles and Bookings

  1. New Tables
    - agent_profiles: Store agent-specific information
    - client_profiles: Store client-specific information
    - bookings: Track property viewing bookings

  2. Security
    - Enable RLS on new tables
    - Add policies for proper access control

  3. Changes
    - Add indexes for performance optimization
    - Add foreign key constraints
*/

-- Agent profiles table
CREATE TABLE IF NOT EXISTS agent_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  photo_url TEXT,
  bio TEXT,
  areas TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  subscription_tier TEXT NOT NULL CHECK (subscription_tier IN ('basic', 'premium')),
  subscription_status TEXT NOT NULL CHECK (subscription_status IN ('trial', 'active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_agent_user_id UNIQUE (user_id)
);

-- Client profiles table
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  preferred_areas TEXT[] DEFAULT '{}',
  preferred_contact TEXT CHECK (preferred_contact IN ('email', 'phone', 'both')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_client_user_id UNIQUE (user_id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  time_slot_id UUID NOT NULL REFERENCES showing_time_slots(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id),
  agent_id UUID NOT NULL REFERENCES auth.users(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  attendees INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for agent_profiles
CREATE POLICY "Users can view agent profiles"
  ON agent_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents can update their own profile"
  ON agent_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for client_profiles
CREATE POLICY "Clients can manage their own profile"
  ON client_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = agent_id);

CREATE POLICY "Clients can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = agent_id)
  WITH CHECK (auth.uid() = client_id OR auth.uid() = agent_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_agent_id ON bookings(agent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);

-- Add triggers for updated_at
CREATE TRIGGER update_agent_profiles_updated_at
  BEFORE UPDATE ON agent_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_client_profiles_updated_at
  BEFORE UPDATE ON client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();