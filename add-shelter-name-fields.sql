-- =====================================================
-- ADD SHELTER NAME FIELDS TO ALL CONTENT TABLES
-- =====================================================
-- This adds shelter_name fields to store the user-entered shelter names
-- alongside the existing shelter_id foreign keys

-- Add shelter_name to dogs table
ALTER TABLE public.dogs 
ADD COLUMN IF NOT EXISTS shelter_name TEXT;

-- Add shelter_name to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS shelter_name TEXT;

-- Add shelter_name to shelter_stories table
ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS shelter_name TEXT;

-- Add shelter_name to volunteer_opportunities table
ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS shelter_name TEXT;

-- Add shelter_name to supply_needs table
ALTER TABLE public.supply_needs 
ADD COLUMN IF NOT EXISTS shelter_name TEXT;

-- Create indexes for better performance when searching by shelter name
CREATE INDEX IF NOT EXISTS idx_dogs_shelter_name ON public.dogs(shelter_name);
CREATE INDEX IF NOT EXISTS idx_events_shelter_name ON public.events(shelter_name);
CREATE INDEX IF NOT EXISTS idx_shelter_stories_shelter_name ON public.shelter_stories(shelter_name);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_shelter_name ON public.volunteer_opportunities(shelter_name);
CREATE INDEX IF NOT EXISTS idx_supply_needs_shelter_name ON public.supply_needs(shelter_name);

-- Update existing records to populate shelter_name from shelters table
-- (This will only work if the shelter_id foreign keys are properly set)

UPDATE public.dogs 
SET shelter_name = shelters.name 
FROM public.shelters 
WHERE dogs.shelter_id = shelters.id 
AND dogs.shelter_name IS NULL;

UPDATE public.events 
SET shelter_name = shelters.name 
FROM public.shelters 
WHERE events.shelter_id = shelters.id 
AND events.shelter_name IS NULL;

UPDATE public.shelter_stories 
SET shelter_name = shelters.name 
FROM public.shelters 
WHERE shelter_stories.shelter_id = shelters.id 
AND shelter_stories.shelter_name IS NULL;

UPDATE public.volunteer_opportunities 
SET shelter_name = shelters.name 
FROM public.shelters 
WHERE volunteer_opportunities.shelter_id = shelters.id 
AND volunteer_opportunities.shelter_name IS NULL;

UPDATE public.supply_needs 
SET shelter_name = shelters.name 
FROM public.shelters 
WHERE supply_needs.shelter_id = shelters.id 
AND supply_needs.shelter_name IS NULL;

-- Refresh the PostgREST schema cache
NOTIFY pgrst, 'reload schema';