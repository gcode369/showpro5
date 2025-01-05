/*
  # Lead Scoring and Activity Tracking System

  1. New Tables
    - lead_scores: Stores lead scoring data
    - lead_activities: Tracks lead engagement activities
    - property_views: Tracks property view history
    - automated_followups: Manages follow-up reminders

  2. Functions
    - calculate_lead_score: Automatically calculates lead score based on activities
    - generate_followup_tasks: Creates automated follow-up reminders

  3. Triggers
    - update_lead_score: Updates score when new activities occur
    - create_followup_reminder: Creates follow-up tasks based on lead activity
*/

-- Lead scores table
CREATE TABLE lead_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id),
  agent_id UUID REFERENCES auth.users(id),
  total_score INTEGER DEFAULT 0,
  prequalification_score INTEGER DEFAULT 0,
  property_match_score INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  last_calculated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lead activities table
CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id),
  agent_id UUID REFERENCES auth.users(id),
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'property_view',
    'booking_request',
    'open_house_registration',
    'return_visit',
    'contact_agent'
  )),
  property_id UUID REFERENCES properties(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Property views tracking
CREATE TABLE property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  client_id UUID REFERENCES auth.users(id),
  view_count INTEGER DEFAULT 1,
  first_viewed_at TIMESTAMPTZ DEFAULT now(),
  last_viewed_at TIMESTAMPTZ DEFAULT now()
);

-- Automated follow-ups
CREATE TABLE automated_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES auth.users(id),
  client_id UUID REFERENCES auth.users(id),
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'high_engagement',
    'property_match',
    'return_visit',
    'inactive_lead'
  )),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  due_date TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(p_client_id UUID, p_agent_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_total_score INTEGER := 0;
  v_client client_profiles;
  v_activities lead_activities[];
BEGIN
  -- Get client profile
  SELECT * INTO v_client FROM client_profiles WHERE user_id = p_client_id;
  
  -- Base score from pre-qualification (up to 30 points)
  IF v_client.prequalified THEN
    v_total_score := v_total_score + 30;
  END IF;

  -- Engagement score (up to 40 points)
  SELECT COUNT(*) * 5 INTO v_total_score
  FROM lead_activities
  WHERE client_id = p_client_id
  AND agent_id = p_agent_id
  AND created_at > now() - interval '30 days';

  -- Property match score (up to 30 points)
  -- Implementation depends on property matching logic

  RETURN LEAST(v_total_score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql;

-- Trigger to update lead score on new activity
CREATE OR REPLACE FUNCTION update_lead_score_on_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate new score
  WITH new_score AS (
    SELECT calculate_lead_score(NEW.client_id, NEW.agent_id) as score
  )
  INSERT INTO lead_scores (client_id, agent_id, total_score)
  VALUES (NEW.client_id, NEW.agent_id, (SELECT score FROM new_score))
  ON CONFLICT (client_id, agent_id) DO UPDATE
  SET total_score = (SELECT score FROM new_score),
      updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_score_trigger
  AFTER INSERT ON lead_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_score_on_activity();

-- Function to create follow-up reminders
CREATE OR REPLACE FUNCTION create_followup_reminder()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_score >= 70 AND NOT EXISTS (
    SELECT 1 FROM automated_followups
    WHERE client_id = NEW.client_id
    AND agent_id = NEW.agent_id
    AND trigger_type = 'high_engagement'
    AND created_at > now() - interval '7 days'
  ) THEN
    INSERT INTO automated_followups (
      agent_id,
      client_id,
      trigger_type,
      due_date,
      notes
    ) VALUES (
      NEW.agent_id,
      NEW.client_id,
      'high_engagement',
      now() + interval '1 day',
      'High-scoring lead requires follow-up'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_followup_reminder_trigger
  AFTER INSERT OR UPDATE ON lead_scores
  FOR EACH ROW
  EXECUTE FUNCTION create_followup_reminder();

-- Enable RLS
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_followups ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Agents can view their leads' scores"
  ON lead_scores FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Agents can view their leads' activities"
  ON lead_activities FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Track property views"
  ON property_views
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Agents can manage their follow-ups"
  ON automated_followups
  FOR ALL
  TO authenticated
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());