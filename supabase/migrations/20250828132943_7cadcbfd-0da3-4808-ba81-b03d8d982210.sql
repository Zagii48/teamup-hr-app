-- Fix pgcrypto extension schema issue
-- Drop existing extension and recreate in public schema
DROP EXTENSION IF EXISTS pgcrypto;
CREATE EXTENSION pgcrypto WITH SCHEMA public;

-- Test that crypt and gen_salt functions are accessible
-- This will verify our functions can now use these properly
SELECT crypt('test', gen_salt('bf')) AS test_hash;