-- =====================================================
-- URGENT DATABASE SCHEMA FIX
-- =====================================================
-- Run this IMMEDIATELY in your Supabase SQL Editor to fix the schema errors

-- 1. Fix shelter_stories table - add missing columns
ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS dog_name TEXT;

ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS author_name TEXT;

ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS photo_urls TEXT[] DEFAULT '{}';

-- 2. Update story_type constraint to match what the app expects
ALTER TABLE public.shelter_stories 
DROP CONSTRAINT IF EXISTS shelter_stories_story_type_check;

ALTER TABLE public.shelter_stories 
ADD CONSTRAINT shelter_stories_story_type_check 
CHECK (story_type IN ('update', 'success_story', 'urgent_need', 'event', 'thank_you', 'rescue_story', 'volunteer_story', 'general', 'fundraising'));

-- 3. Ensure dogs table has both medical fields
ALTER TABLE public.dogs 
ADD COLUMN IF NOT EXISTS medical_info TEXT;

ALTER TABLE public.dogs 
ADD COLUMN IF NOT EXISTS medical_notes TEXT;

-- 4. Fix volunteer_opportunities table
ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'animal_care';

ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'beginner';

ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS date DATE;

ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS start_time TIME;

ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS end_time TIME;

ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS location TEXT;

ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;

ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS recurrence_pattern TEXT;

-- 5. Add constraints for volunteer_opportunities
ALTER TABLE public.volunteer_opportunities 
DROP CONSTRAINT IF EXISTS volunteer_opportunities_category_check;

ALTER TABLE public.volunteer_opportunities 
ADD CONSTRAINT volunteer_opportunities_category_check 
CHECK (category IN ('animal_care', 'medical', 'training', 'administration', 'events', 'transport', 'other'));

ALTER TABLE public.volunteer_opportunities 
DROP CONSTRAINT IF EXISTS volunteer_opportunities_difficulty_check;

ALTER TABLE public.volunteer_opportunities 
ADD CONSTRAINT volunteer_opportunities_difficulty_check 
CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'));

-- 6. CRITICAL: Refresh the PostgREST schema cache
-- This is essential to make the new columns available immediately
NOTIFY pgrst, 'reload schema';

-- 7. Grant necessary permissions (if needed)
GRANT ALL ON public.shelter_stories TO authenticated;
GRANT ALL ON public.dogs TO authenticated;
GRANT ALL ON public.volunteer_opportunities TO authenticated;
GRANT ALL ON public.supply_needs TO authenticated;
GRANT ALL ON public.events TO authenticated;

-- 8. Verify the changes worked
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'shelter_stories' 
AND table_schema = 'public'
ORDER BY column_name;