-- Clean up any remaining test data
DELETE FROM properties WHERE title LIKE 'Test%' OR description LIKE 'Test%';
DELETE FROM agent_profiles WHERE name LIKE 'Test%';
DELETE FROM client_profiles WHERE name LIKE 'Test%';

-- Add email templates table
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Insert default email templates
INSERT INTO email_templates (name, subject, html_content, text_content) VALUES
  ('welcome', 'Welcome to ShowPro', '{{name}}, welcome to ShowPro!', 'Welcome to ShowPro, {{name}}!'),
  ('booking_confirmation', 'Booking Confirmed', 'Your showing has been confirmed', 'Your showing has been confirmed'),
  ('password_reset', 'Reset Your Password', 'Click to reset your password', 'Reset your password');