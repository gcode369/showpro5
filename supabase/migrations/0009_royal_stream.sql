/*
  # Update client profiles with preferences and pre-qualification

  1. New Fields
    - Added property preferences
    - Added pre-qualification status and details
    - Added preferred price range
    - Added preferred property types

  2. Changes
    - Added new columns to client_profiles table
    - Added validation checks for price ranges
*/

ALTER TABLE client_profiles
ADD COLUMN property_preferences JSONB DEFAULT '{
  "bedrooms": null,
  "bathrooms": null,
  "min_square_feet": null,
  "max_square_feet": null,
  "features": [],
  "property_types": []
}'::jsonb,
ADD COLUMN prequalified BOOLEAN DEFAULT false,
ADD COLUMN prequalification_details JSONB DEFAULT '{
  "amount": null,
  "lender": null,
  "expiry_date": null,
  "verified": false
}'::jsonb,
ADD COLUMN min_price DECIMAL,
ADD COLUMN max_price DECIMAL,
ADD COLUMN preferred_property_types TEXT[] DEFAULT '{}',
ADD CONSTRAINT price_range_check CHECK (min_price IS NULL OR max_price IS NULL OR min_price <= max_price);