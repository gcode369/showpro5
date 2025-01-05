-- Lead capture system tables
CREATE TABLE open_house_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  open_house_id UUID NOT NULL REFERENCES properties(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  interested_in_similar BOOLEAN DEFAULT false,
  prequalified BOOLEAN DEFAULT false,
  follow_up_status TEXT NOT NULL CHECK (follow_up_status IN ('pending', 'contacted', 'not_interested')),
  registration_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE open_house_leads ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Agents can view leads for their properties"
  ON open_house_leads
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = open_house_leads.open_house_id
    AND properties.agent_id = auth.uid()
  ));

CREATE POLICY "Agents can manage leads for their properties"
  ON open_house_leads
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = open_house_leads.open_house_id
    AND properties.agent_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = open_house_leads.open_house_id
    AND properties.agent_id = auth.uid()
  ));

-- Add updated_at trigger
CREATE TRIGGER update_open_house_leads_updated_at
  BEFORE UPDATE ON open_house_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();