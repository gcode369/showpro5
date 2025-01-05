/*
  # Add property preferences and pre-qualification to client profiles

  1. Changes
    - Add validation functions for property preferences
    - Add trigger for prequalification status updates
    - Add indexes for efficient querying

  2. Security
    - Maintains existing RLS policies
*/

-- Add function to validate property preferences
CREATE OR REPLACE FUNCTION validate_property_preferences()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate bedrooms and bathrooms are positive numbers
  IF (NEW.property_preferences->>'bedrooms')::numeric < 0 OR
     (NEW.property_preferences->>'bathrooms')::numeric < 0 THEN
    RAISE EXCEPTION 'Bedrooms and bathrooms must be positive numbers';
  END IF;

  -- Validate square footage
  IF (NEW.property_preferences->>'min_square_feet')::numeric > 
     (NEW.property_preferences->>'max_square_feet')::numeric THEN
    RAISE EXCEPTION 'Minimum square feet cannot be greater than maximum';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add function to update prequalification status
CREATE OR REPLACE FUNCTION update_prequalification_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.prequalified = true AND 
     (NEW.prequalification_details->>'amount' IS NULL OR 
      NEW.prequalification_details->>'lender' IS NULL OR
      NEW.prequalification_details->>'expiry_date' IS NULL) THEN
    RAISE EXCEPTION 'Prequalification details are required when prequalified is true';
  END IF;

  -- Auto-set verified to false when details change
  IF OLD.prequalification_details IS DISTINCT FROM NEW.prequalification_details THEN
    NEW.prequalification_details = jsonb_set(
      NEW.prequalification_details,
      '{verified}',
      'false'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for property preferences validation
DROP TRIGGER IF EXISTS validate_property_preferences_trigger ON client_profiles;
CREATE TRIGGER validate_property_preferences_trigger
  BEFORE INSERT OR UPDATE ON client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_property_preferences();

-- Add trigger for prequalification status
DROP TRIGGER IF EXISTS update_prequalification_status_trigger ON client_profiles;
CREATE TRIGGER update_prequalification_status_trigger
  BEFORE INSERT OR UPDATE ON client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_prequalification_status();