-- =====================================================
-- UNIFIED SCHEMA MIGRATION
-- =====================================================
-- This migration applies the unified schema patterns to existing database
-- Run this AFTER the base schema is already in place

BEGIN;

-- =====================================================
-- 1. ADD MISSING STATUS COLUMNS
-- =====================================================

-- Add status to shelters if missing
ALTER TABLE public.shelters 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));

-- Add status to profiles if missing
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));

-- Add status to shelter_stories if missing
ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));

-- Add status to volunteer_opportunities if missing
ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'cancelled'));

-- Add status to supply_needs if missing
ALTER TABLE public.supply_needs 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled'));

-- =====================================================
-- 2. UPDATE EXISTING DATA TO USE NEW STATUS FIELDS
-- =====================================================

-- Update shelter_stories status based on is_published
UPDATE public.shelter_stories 
SET status = CASE 
    WHEN is_published = true THEN 'published' 
    ELSE 'draft' 
END
WHERE status IS NULL OR status = 'published';

-- Update volunteer_opportunities status based on is_active
UPDATE public.volunteer_opportunities 
SET status = CASE 
    WHEN is_active = true THEN 'active' 
    ELSE 'inactive' 
END
WHERE status IS NULL OR status = 'active';

-- Update supply_needs status based on is_fulfilled
UPDATE public.supply_needs 
SET status = CASE 
    WHEN is_fulfilled = true THEN 'fulfilled' 
    ELSE 'active' 
END
WHERE status IS NULL OR status = 'active';

-- =====================================================
-- 3. CREATE EVENTS TABLE IF NOT EXISTS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shelter_id UUID NOT NULL REFERENCES public.shelters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_type TEXT NOT NULL DEFAULT 'adoption_event' CHECK (event_type IN ('adoption_event', 'fundraiser', 'volunteer_day', 'community_event', 'training', 'other')),
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location TEXT,
    address TEXT,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    registration_required BOOLEAN DEFAULT false,
    registration_link TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern TEXT,
    photo_urls TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE INTERACTION TABLES IF NOT EXISTS
-- =====================================================

-- Event RSVPs table
CREATE TABLE IF NOT EXISTS public.event_rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    number_of_attendees INTEGER DEFAULT 1,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supply donations table
CREATE TABLE IF NOT EXISTS public.supply_donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supply_need_id UUID NOT NULL REFERENCES public.supply_needs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    donor_phone TEXT,
    quantity_donated INTEGER NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pledged' CHECK (status IN ('pledged', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. ADD MISSING COLUMNS TO EXISTING TABLES
-- =====================================================

-- Add photo_urls to shelter_stories if missing
ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS photo_urls TEXT[] DEFAULT '{}';

-- Add is_featured to shelter_stories if missing
ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Add story_type to shelter_stories if missing
ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS story_type TEXT DEFAULT 'general' CHECK (story_type IN ('success_story', 'rescue_story', 'volunteer_story', 'general', 'fundraising'));

-- Add author_name to shelter_stories if missing
ALTER TABLE public.shelter_stories 
ADD COLUMN IF NOT EXISTS author_name TEXT;

-- Add opportunity_type to volunteer_opportunities if missing
ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS opportunity_type TEXT DEFAULT 'general' CHECK (opportunity_type IN ('dog_walking', 'cleaning', 'events', 'transport', 'fostering', 'administrative', 'general'));

-- Add additional fields to volunteer_opportunities if missing
ALTER TABLE public.volunteer_opportunities 
ADD COLUMN IF NOT EXISTS requirements TEXT,
ADD COLUMN IF NOT EXISTS time_commitment TEXT,
ADD COLUMN IF NOT EXISTS schedule TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS max_volunteers INTEGER,
ADD COLUMN IF NOT EXISTS current_volunteers INTEGER DEFAULT 0;

-- Add category and priority to supply_needs if missing
ALTER TABLE public.supply_needs 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general' CHECK (category IN ('food', 'toys', 'medical', 'cleaning', 'bedding', 'equipment', 'general')),
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS quantity_needed INTEGER,
ADD COLUMN IF NOT EXISTS quantity_received INTEGER DEFAULT 0;

-- =====================================================
-- 6. CREATE/UPDATE UNIFIED CONTENT VIEW
-- =====================================================
DROP VIEW IF EXISTS public.unified_content;
CREATE VIEW public.unified_content AS
SELECT 
    'dog' as content_type,
    id,
    shelter_id,
    name as title,
    description,
    status,
    created_at,
    updated_at,
    photo_urls
FROM public.dogs
UNION ALL
SELECT 
    'story' as content_type,
    id,
    shelter_id,
    title,
    content as description,
    status,
    created_at,
    updated_at,
    photo_urls
FROM public.shelter_stories
UNION ALL
SELECT 
    'event' as content_type,
    id,
    shelter_id,
    title,
    description,
    status,
    created_at,
    updated_at,
    photo_urls
FROM public.events
UNION ALL
SELECT 
    'volunteer_opportunity' as content_type,
    id,
    shelter_id,
    title,
    description,
    status,
    created_at,
    updated_at,
    ARRAY[]::TEXT[] as photo_urls
FROM public.volunteer_opportunities
UNION ALL
SELECT 
    'supply_need' as content_type,
    id,
    shelter_id,
    item_name as title,
    description,
    status,
    created_at,
    updated_at,
    ARRAY[]::TEXT[] as photo_urls
FROM public.supply_needs;

-- =====================================================
-- 7. CREATE PERFORMANCE INDEXES
-- =====================================================

-- Core table indexes
CREATE INDEX IF NOT EXISTS idx_shelters_status ON public.shelters(status);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Content table indexes
CREATE INDEX IF NOT EXISTS idx_dogs_shelter_id ON public.dogs(shelter_id);
CREATE INDEX IF NOT EXISTS idx_dogs_status ON public.dogs(status);

CREATE INDEX IF NOT EXISTS idx_events_shelter_id ON public.events(shelter_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);

CREATE INDEX IF NOT EXISTS idx_shelter_stories_shelter_id ON public.shelter_stories(shelter_id);
CREATE INDEX IF NOT EXISTS idx_shelter_stories_status ON public.shelter_stories(status);
CREATE INDEX IF NOT EXISTS idx_shelter_stories_is_featured ON public.shelter_stories(is_featured);

CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_shelter_id ON public.volunteer_opportunities(shelter_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_status ON public.volunteer_opportunities(status);

CREATE INDEX IF NOT EXISTS idx_supply_needs_shelter_id ON public.supply_needs(shelter_id);
CREATE INDEX IF NOT EXISTS idx_supply_needs_status ON public.supply_needs(status);
CREATE INDEX IF NOT EXISTS idx_supply_needs_priority ON public.supply_needs(priority);

-- Interaction table indexes
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_opportunity_id ON public.volunteer_signups(volunteer_opportunity_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_user_id ON public.volunteer_signups(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_status ON public.volunteer_signups(status);

CREATE INDEX IF NOT EXISTS idx_event_rsvps_event_id ON public.event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON public.event_rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_status ON public.event_rsvps(status);

CREATE INDEX IF NOT EXISTS idx_supply_donations_supply_need_id ON public.supply_donations(supply_need_id);
CREATE INDEX IF NOT EXISTS idx_supply_donations_user_id ON public.supply_donations(user_id);
CREATE INDEX IF NOT EXISTS idx_supply_donations_status ON public.supply_donations(status);

-- =====================================================
-- 8. ENABLE ROW LEVEL SECURITY ON NEW TABLES
-- =====================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_donations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 9. UPDATE RLS POLICIES FOR CONSISTENCY
-- =====================================================

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Anyone can view active events" ON public.events;
DROP POLICY IF EXISTS "Anyone can view published stories" ON public.shelter_stories;
DROP POLICY IF EXISTS "Anyone can view active opportunities" ON public.volunteer_opportunities;
DROP POLICY IF EXISTS "Anyone can view supply needs" ON public.supply_needs;
DROP POLICY IF EXISTS "Anyone can view active supply needs" ON public.supply_needs;

-- Create unified public read policies
CREATE POLICY "Public can view all events"
    ON public.events FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view published stories"
    ON public.shelter_stories FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Public can view active opportunities"
    ON public.volunteer_opportunities FOR SELECT
    TO anon, authenticated
    USING (status = 'active');

CREATE POLICY "Public can view active supply needs"
    ON public.supply_needs FOR SELECT
    TO anon, authenticated
    USING (status = 'active');

-- Shelter management policies
DROP POLICY IF EXISTS "Shelter staff can manage their events" ON public.events;
CREATE POLICY "Shelter staff can manage their events"
    ON public.events FOR ALL
    TO authenticated
    USING (
        shelter_id IN (
            SELECT shelter_id FROM public.profiles WHERE id = auth.uid() AND role IN ('shelter', 'admin')
        )
    );

-- User interaction policies
CREATE POLICY "Users can manage their RSVPs"
    ON public.event_rsvps FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage their donations"
    ON public.supply_donations FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- =====================================================
-- 10. GRANT PERMISSIONS
-- =====================================================
GRANT SELECT ON public.events TO anon, authenticated;
GRANT SELECT ON public.unified_content TO anon, authenticated;
GRANT ALL ON public.event_rsvps TO authenticated;
GRANT ALL ON public.supply_donations TO authenticated;

-- =====================================================
-- 11. CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to get shelter content summary
CREATE OR REPLACE FUNCTION public.get_shelter_content_summary(p_shelter_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN json_build_object(
        'dogs', (SELECT COUNT(*) FROM dogs WHERE shelter_id = p_shelter_id AND status IN ('available', 'foster')),
        'events', (SELECT COUNT(*) FROM events WHERE shelter_id = p_shelter_id AND status = 'active'),
        'stories', (SELECT COUNT(*) FROM shelter_stories WHERE shelter_id = p_shelter_id AND status = 'published'),
        'opportunities', (SELECT COUNT(*) FROM volunteer_opportunities WHERE shelter_id = p_shelter_id AND status = 'active'),
        'supply_needs', (SELECT COUNT(*) FROM supply_needs WHERE shelter_id = p_shelter_id AND status = 'active')
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_shelter_content_summary(UUID) TO authenticated;

COMMIT;

-- =====================================================
-- 12. VERIFICATION QUERIES
-- =====================================================
-- Run these after the migration to verify everything worked:

-- Check that all tables have status columns
-- SELECT table_name, column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' 
-- AND column_name = 'status'
-- AND table_name IN ('shelters', 'profiles', 'dogs', 'events', 'shelter_stories', 'volunteer_opportunities', 'supply_needs')
-- ORDER BY table_name;

-- Check unified content view works
-- SELECT content_type, COUNT(*) FROM public.unified_content GROUP BY content_type;

-- Check that indexes were created
-- SELECT schemaname, tablename, indexname FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- AND indexname LIKE 'idx_%'
-- ORDER BY tablename, indexname;

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, policyname;