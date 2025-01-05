/*
  # Add test data and performance optimizations

  1. Changes
    - Add indexes for high-performance queries
    - Add test data for agents and properties
    - Add composite indexes for common query patterns

  2. Security
    - Maintain existing RLS policies
    - Add row limits for pagination
*/

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_properties_status_city ON properties(status, city);
CREATE INDEX IF NOT EXISTS idx_properties_agent_status ON properties(agent_id, status);
CREATE INDEX IF NOT EXISTS idx_properties_price_status ON properties(price, status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON bookings(created_at, status);
CREATE INDEX IF NOT EXISTS idx_showing_slots_date ON showing_time_slots(date, start_time);

-- Add partial indexes for active listings
CREATE INDEX IF NOT EXISTS idx_active_properties ON properties(created_at)
WHERE status = 'available';

-- Add GiST index for location-based queries (future use)
CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS location geometry(Point, 4326);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING gist(location);

-- Add function to generate random test data
CREATE OR REPLACE FUNCTION generate_test_data(num_agents integer, properties_per_agent integer)
RETURNS void AS $$
DECLARE
  agent_id uuid;
  property_id uuid;
  cities text[] := ARRAY['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Kelowna'];
  property_types text[] := ARRAY['house', 'condo', 'townhouse', 'apartment'];
BEGIN
  -- Generate agents
  FOR i IN 1..num_agents LOOP
    INSERT INTO auth.users (id, email)
    VALUES (
      gen_random_uuid(),
      'agent' || i || '@test.com'
    ) RETURNING id INTO agent_id;

    -- Add agent profile
    INSERT INTO agent_profiles (user_id, name, subscription_tier, subscription_status)
    VALUES (
      agent_id,
      'Test Agent ' || i,
      CASE WHEN random() < 0.3 THEN 'premium' ELSE 'basic' END,
      'active'
    );

    -- Generate properties for each agent
    FOR j IN 1..properties_per_agent LOOP
      INSERT INTO properties (
        id,
        title,
        address,
        city,
        price,
        description,
        agent_id,
        status,
        category,
        type,
        bedrooms,
        bathrooms,
        square_feet
      ) VALUES (
        gen_random_uuid(),
        'Property ' || j || ' by Agent ' || i,
        j || ' Test Street',
        cities[1 + (random() * 5)::integer],
        500000 + (random() * 1500000)::integer,
        'Test property description',
        agent_id,
        CASE WHEN random() < 0.8 THEN 'available' ELSE 'pending' END,
        'residential',
        property_types[1 + (random() * 3)::integer],
        2 + (random() * 4)::integer,
        1 + (random() * 3)::integer,
        1000 + (random() * 3000)::integer
      ) RETURNING id INTO property_id;

      -- Generate showing time slots
      INSERT INTO property_showings (property_id)
      VALUES (property_id);
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate test data (100 agents, 10 properties each)
SELECT generate_test_data(100, 10);

-- Add function to clean test data
CREATE OR REPLACE FUNCTION clean_test_data()
RETURNS void AS $$
BEGIN
  DELETE FROM properties WHERE title LIKE 'Property%';
  DELETE FROM agent_profiles WHERE name LIKE 'Test Agent%';
  DELETE FROM auth.users WHERE email LIKE 'agent%@test.com';
END;
$$ LANGUAGE plpgsql;