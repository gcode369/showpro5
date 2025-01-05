-- Add username column to agent_profiles
ALTER TABLE agent_profiles
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index for username searches
CREATE INDEX IF NOT EXISTS idx_agent_profiles_username 
ON agent_profiles(username);

-- Add policy for username searches
CREATE POLICY "Allow username searches"
ON agent_profiles
FOR SELECT
TO authenticated
USING (true);