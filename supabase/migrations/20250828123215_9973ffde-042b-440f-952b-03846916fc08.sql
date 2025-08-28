-- Insert test users TestKor and Admin
INSERT INTO public.users (full_name, nickname, phone, password_hash)
VALUES 
  ('Test Korisnik', 'TestKor', '+385991234561', crypt('Test123', gen_salt('bf'))),
  ('Admin User', 'Admin', '+385991234562', crypt('Test123', gen_salt('bf')));