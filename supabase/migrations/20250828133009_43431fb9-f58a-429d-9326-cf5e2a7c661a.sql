-- Create a dedicated schema for extensions and move pgcrypto there
CREATE SCHEMA IF NOT EXISTS extensions;
DROP EXTENSION IF EXISTS pgcrypto;
CREATE EXTENSION pgcrypto WITH SCHEMA extensions;

-- Update the search_path for our functions to include extensions schema
-- This allows our functions to access pgcrypto without it being in public
ALTER FUNCTION public.authenticate_user(text, text) SET search_path = public, extensions;
ALTER FUNCTION public.create_user_account(text, text, text, text) SET search_path = public, extensions;

-- Test that functions still work
SELECT extensions.crypt('test', extensions.gen_salt('bf')) AS test_hash;