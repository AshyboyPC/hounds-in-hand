-- =====================================================
-- Connect 4 Paws - Schema Fixes for Database Integration
-- =====================================================
-- Run this to fix any schema issues after the integration

-- =====================================================
-- 1. ADD MISSING SHELTER ACCESS CODE
-- =====================================================
INSERT INTO public.shelters (name, access_code, state, website, description)
VALUES 
(
    'Hope for Hounds Rescue',
    'HOPEFORHOUNDS',
    'GA',
    'https://hopeforhounds.org',
    'Dedicated to rescuing and rehoming dogs in need throughout Georgia.'
)
ON CONFLICT (access_code) DO NOTHING;

-- =====================================================
-- 2. UPDATE DOGS TABLE POLICIES (if needed)
-- =====================================================
-- Make sure anyone can view available and foster dogs
DROP POLICY IF EXISTS "Anyone can view available dogs" ON public.dogs;
CREATE POLICY "Anyone can view available dogs"
    ON public.dogs FOR SELECT
    USING (status IN ('available', 'foster'));

-- Add a more permissive policy for debugging (can be removed later)
DROP POLICY IF EXISTS "Public can view all dogs" ON public.dogs;
CREATE POLICY "Public can view all dogs"
    ON public.dogs FOR SELECT
    TO anon, authenticated
    USING (true);

-- =====================================================
-- 3. UPDATE SUPPLY NEEDS POLICIES (if needed)
-- =====================================================
-- Make sure anyone can view unfulfilled supply needs
DROP POLICY IF EXISTS "Anyone can view supply needs" ON public.supply_needs;
CREATE POLICY "Anyone can view supply needs"
    ON public.supply_needs FOR SELECT
    USING (is_fulfilled = false OR is_fulfilled IS NULL);

-- =====================================================
-- 4. ENSURE ALL INDEXES EXIST
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_dogs_status ON public.dogs(status);
CREATE INDEX IF NOT EXISTS idx_dogs_is_dog_of_week ON public.dogs(is_dog_of_week);
CREATE INDEX IF NOT EXISTS idx_supply_needs_fulfilled ON public.supply_needs(is_fulfilled);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_status ON public.volunteer_opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_shelter_stories_published ON public.shelter_stories(is_published);

-- =====================================================
-- 5. ADD MISSING COLUMNS (if they don't exist)
-- =====================================================
-- These should already exist from the main schema, but just in case
ALTER TABLE public.dogs 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available' CHECK (status IN ('available', 'foster', 'pending', 'adopted'));

ALTER TABLE public.dogs 
ADD COLUMN IF NOT EXISTS photo_urls TEXT[] DEFAULT '{}';

-- =====================================================
-- 6. UPDATE VOLUNTEER OPPORTUNITIES STATUS FIELD
-- =====================================================
-- Make sure the status field is properly named
ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed'));

-- Update existing records to use new status field if is_active exists
UPDATE public.volunteer_opportunities 
SET status = CASE 
    WHEN is_active = true THEN 'active' 
    ELSE 'inactive' 
END
WHERE status IS NULL;

-- =====================================================
-- 7. GRANT NECESSARY PERMISSIONS
-- =====================================================
-- Make sure authenticated users can access all necessary tables
GRANT SELECT ON public.dogs TO authenticated;
GRANT SELECT ON public.shelter_stories TO authenticated;
GRANT SELECT ON public.volunteer_opportunities TO authenticated;
GRANT SELECT ON public.supply_needs TO authenticated;
GRANT SELECT ON public.shelters TO authenticated;

-- Allow users to insert their own volunteer signups
GRANT INSERT ON public.volunteer_signups TO authenticated;
GRANT SELECT ON public.volunteer_signups TO authenticated;
GRANT UPDATE ON public.volunteer_signups TO authenticated;

-- =====================================================
-- 8. REFRESH POLICIES (if needed)
-- =====================================================
-- Ensure all RLS policies are active
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shelter_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 9. TEST DATA (Optional - for development)
-- =====================================================
-- Uncomment these if you want some test data

/*
-- Test dog
INSERT INTO public.dogs (shelter_id, name, breed, age, age_category, size, gender, temperament, description, status, is_dog_of_week)
SELECT 
    s.id,
    'Buddy',
    'Golden Retriever',
    '3 years',
    'adult',
    'large',
    'male',
    ARRAY['Friendly', 'Energetic', 'Good with kids'],
    'Buddy is a wonderful dog looking for his forever home. He loves playing fetch and is great with children.',
    'available',
    true
FROM public.shelters s 
WHERE s.access_code = 'HOPEFORHOUNDS'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Test story
INSERT INTO public.shelter_stories (shelter_id, title, content, story_type, is_published)
SELECT 
    s.id,
    'Buddy Found His Forever Home!',
    'We are thrilled to share that Buddy has been adopted by a wonderful family. After months of waiting, he finally found his perfect match!',
    'success_story',
    true
FROM public.shelters s 
WHERE s.access_code = 'HOPEFORHOUNDS'
LIMIT 1
ON CONFLICT DO NOTHING;
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify everything is working:

-- Check if shelters exist
-- SELECT name, access_code FROM public.shelters;

-- Check if tables have correct structure
-- \d public.dogs
-- \d public.shelter_stories
-- \d public.volunteer_opportunities
-- \d public.supply_needs

-- Check policies are active
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';