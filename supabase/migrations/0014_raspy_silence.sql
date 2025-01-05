/*
  # Clean up test data

  1. Cleanup
    - Remove all test agents and their data
    - Remove test data generation functions
  
  2. Changes
    - Drop test data generation functions
    - Remove test data from database
*/

-- Clean up test data
DELETE FROM properties WHERE title LIKE 'Property%';
DELETE FROM agent_profiles WHERE name LIKE 'Test Agent%';
DELETE FROM auth.users WHERE email LIKE 'agent%@test.com';

-- Drop test data generation functions
DROP FUNCTION IF EXISTS generate_test_data(integer, integer);
DROP FUNCTION IF EXISTS clean_test_data();