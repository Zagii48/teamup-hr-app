-- Create users table for username/password authentication
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  nickname TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Create sports table with slugs
CREATE TABLE public.sports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sports table
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;

-- Create policy for sports (publicly readable)
CREATE POLICY "Sports are viewable by everyone" 
ON public.sports 
FOR SELECT 
USING (true);

-- Add trigger for users updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default sports data
INSERT INTO public.sports (name, slug, description, icon_name) VALUES
('Nogomet', 'nogomet', 'Najpopularniji sport na svijetu', 'Trophy'),
('Košarka', 'kosarka', 'Brza dinamična igra', 'Trophy'),
('Tenis', 'tenis', 'Elegantna igra lopticom', 'Trophy'),
('Odbojka', 'odbojka', 'Timski sport s mrežom', 'Trophy'),
('Rukomet', 'rukomet', 'Brzina i preciznost', 'Trophy'),
('Badminton', 'badminton', 'Igra s perjanicama', 'Trophy');

-- Create authentication functions
CREATE OR REPLACE FUNCTION public.authenticate_user(username_input TEXT, password_input TEXT)
RETURNS TABLE(user_id UUID, full_name TEXT, nickname TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
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