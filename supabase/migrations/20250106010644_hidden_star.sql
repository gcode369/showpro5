-- Update RLS policies for properties table
DROP POLICY IF EXISTS "Agents can manage their own properties" ON properties;
DROP POLICY IF EXISTS "Everyone can view available properties" ON properties;

CREATE POLICY "Agents can manage their own properties"
ON properties
FOR ALL 
TO authenticated
USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'agent' 
  AND agent_id = auth.uid()
)
WITH CHECK (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'agent' 
  AND agent_id = auth.uid()
);

CREATE POLICY "Everyone can view properties"
ON properties
FOR SELECT
TO authenticated
USING (true);