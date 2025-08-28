-- Fix security issues by setting search_path on functions
CREATE OR REPLACE FUNCTION public.authenticate_user(username_input TEXT, password_input TEXT)
RETURNS TABLE(user_id UUID, full_name TEXT, nickname TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.full_name, u.nickname 
  FROM public.users u
  WHERE u.nickname = username_input 
  AND crypt(password_input, u.password_hash) = u.password_hash;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_user_account(
  full_name_input TEXT,
  nickname_input TEXT,
  phone_input TEXT,
  password_input TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  INSERT INTO public.users (full_name, nickname, phone, password_hash)
  VALUES (
    full_name_input,
    nickname_input,
    phone_input,
    crypt(password_input, gen_salt('bf'))
  )
  RETURNING id INTO new_user_id;
  
  RETURN new_user_id;
END;
$$;