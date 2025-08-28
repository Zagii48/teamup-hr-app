-- Add price field to events table
ALTER TABLE public.events 
ADD COLUMN price DECIMAL(10,2) DEFAULT 0;

-- Add cancelled status to event_status enum
ALTER TYPE event_status ADD VALUE 'cancelled';

-- Update RLS policies to handle cancelled events
-- (existing policies will work, but we should ensure cancelled events are still visible)