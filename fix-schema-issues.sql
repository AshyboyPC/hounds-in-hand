-- =====================================================
-- FIX SCHEMA ISSUES
-- =====================================================
-- This script fixes the schema mismatches causing errors

-- Ensure shelter_stories has dog_name column
ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS dog_name TEXT;

-- Ensure shelter_stories has photo_url column
ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Ensure shelter_stories has author_name column
ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS author_name TEXT;

-- Ensure shelter_stories has correct story_type values
ALTER TABLE public.shelter_stories 
DROP CONSTRAINT IF EXISTS shelter_stories_story_type_check;

ALTER TABLE public.shelter_stories 
ADD CONSTRAINT shelter_stories_story_type_check 
CHECK (story_type IN ('update', 'success_story', 'urgent_need', 'event', 'thank_you', 'rescue_story', 'volunteer_story', 'general', 'fundraising'));

-- Ensure dogs table has both medical fields
ALTER TABLE public.dogs 
ADD COLUMN IF NOT EXISTS medical_info TEXT;

ALTER TABLE public.dogs 
ADD COLUMN IF NOT EXISTS medical_notes TEXT;

-- Ensure volunteer_opportunities has all required fields
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

-- Add constraints for volunteer_opportunities
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

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';