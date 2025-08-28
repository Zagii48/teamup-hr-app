-- Add co-organizers functionality to events table
CREATE TABLE public.event_co_organizers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  added_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(event_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.event_co_organizers ENABLE ROW LEVEL SECURITY;

-- Create policies for co-organizers
CREATE POLICY "Users can view co-organizers of events they participate in" 
ON public.event_co_organizers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.event_signups 
    WHERE event_id = event_co_organizers.event_id 
    AND user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.events 
    WHERE id = event_co_organizers.event_id 
    AND created_by = auth.uid()
  )
  OR user_id = auth.uid()
);

CREATE POLICY "Event creators can add co-organizers" 
ON public.event_co_organizers 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE id = event_id 
    AND created_by = auth.uid()
  )
);

CREATE POLICY "Event creators can remove co-organizers" 
ON public.event_co_organizers 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE id = event_id 
    AND created_by = auth.uid()
  )
);

-- Create function to check if user is organizer or co-organizer
CREATE OR REPLACE FUNCTION public.is_event_organizer_or_co_organizer(event_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.events 
    WHERE id = event_id AND created_by = user_id
  ) OR EXISTS (
    SELECT 1 FROM public.event_co_organizers 
    WHERE event_id = event_id AND user_id = user_id
  );
$$;