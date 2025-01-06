-- Update RLS policies for properties and related tables
DROP POLICY IF EXISTS "Agents can manage their own properties" ON properties;
DROP POLICY IF EXISTS "Everyone can view properties" ON properties;

CREATE POLICY "Agents can manage their own properties"
ON properties
FOR ALL 
TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = 'agent' 
  AND agent_id = auth.uid()
)
WITH CHECK (
  (auth.jwt() ->> 'role')::text = 'agent' 
  AND agent_id = auth.uid()
);

CREATE POLICY "Everyone can view properties"
ON properties
FOR SELECT
TO authenticated
USING (true);

-- Update property showings policies
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
    AND (auth.jwt() ->> 'role')::text = 'agent'
  )
);