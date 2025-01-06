-- Update RLS policies to handle existing accounts
CREATE OR REPLACE FUNCTION auth.get_role()
RETURNS text AS $$
BEGIN
  -- Get role from JWT, fallback to user metadata
  RETURN COALESCE(
    current_setting('request.jwt.claim.role', true),
    (SELECT raw_user_meta_data->>'role' 
     FROM auth.users 
     WHERE id = auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update properties policy
DROP POLICY IF EXISTS "Agents can manage their own properties" ON properties;
CREATE POLICY "Agents can manage their own properties"
ON properties
FOR ALL 
TO authenticated
USING (
  auth.get_role() = 'agent'
  AND agent_id = auth.uid()
)
WITH CHECK (
  auth.get_role() = 'agent'
  AND agent_id = auth.uid()
);

-- Update property showings policy
DROP POLICY IF EXISTS "Agents can manage their property showings" ON property_showings;
CREATE POLICY "Agents can manage their property showings"
ON property_showings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = property_id
    AND properties.agent_id = auth.uid()
    AND auth.get_role() = 'agent'
  )
);