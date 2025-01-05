-- Add verification and payment fields to agent_profiles
ALTER TABLE agent_profiles
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS verification_documents JSONB DEFAULT '[]'::jsonb;

-- Add verification status enum
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');

-- Create verification requests table
CREATE TABLE agent_verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES auth.users(id),
  status verification_status DEFAULT 'pending',
  documents JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE agent_verification_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view their own verification requests"
  ON agent_verification_requests
  FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can create verification requests"
  ON agent_verification_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (agent_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_agent_verification_requests_updated_at
  BEFORE UPDATE ON agent_verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();