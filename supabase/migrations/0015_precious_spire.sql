/*
  # Fix open houses relationships

  1. Changes
    - Add proper foreign key relationships for open houses table
    - Update indexes and constraints
*/

-- Drop and recreate foreign key relationships
ALTER TABLE open_houses 
  DROP CONSTRAINT IF EXISTS open_houses_agent_id_fkey,
  ADD CONSTRAINT open_houses_agent_id_fkey 
    FOREIGN KEY (agent_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_open_houses_agent_id 
  ON open_houses(agent_id);