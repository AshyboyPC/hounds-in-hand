-- =====================================================
-- Connect 4 Paws - COMPLETE UNIFIED SCHEMA
-- =====================================================
-- This creates a fully standardized schema following unified patterns
-- Run this to establish consistent schema across all content types

-- =====================================================
-- 1. CORE TABLES (Base infrastructure)
-- =====================================================

-- Shelters table (already exists, but ensure consistency)
CREATE TABLE IF NOT EXISTS public.shelters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    access_code TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    website TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (already exists, but ensure consistency)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'community' CHECK (role IN ('community', 'volunteer', 'shelter', 'admin')),
    shelter_id UUID REFERENCES public.shelters(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CONTENT TABLES (Following unified pattern)
-- =====================================================

-- Dogs table (standardize existing)
CREATE TABLE IF NOT EXISTS public.dogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shelter_id UUID NOT NULL REFERENCES public.shelters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    breed TEXT NOT NULL,
    age TEXT,
    age_category TEXT CHECK (age_category IN ('puppy', 'young', 'adult', 'senior')),
    size TEXT CHECK (size IN ('small', 'medium', 'large', 'extra_large')),
    gender TEXT CHECK (gender IN ('male', 'female')),
    temperament TEXT[],
    description TEXT,
    medical_info TEXT,
    medical_notes TEXT,
    adoption_fee DECIMAL(10,2),
    is_dog_of_week BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    photo_urls TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'foster', 'pending', 'adopted', 'hold', 'medical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table (create with unified pattern)
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

-- Shelter stories table (standardize existing)
CREATE TABLE IF NOT EXISTS public.shelter_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shelter_id UUID NOT NULL REFERENCES public.shelters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    story_type TEXT DEFAULT 'general' CHECK (story_type IN ('update', 'success_story', 'urgent_need', 'event', 'thank_you', 'rescue_story', 'volunteer_story', 'general', 'fundraising')),
    dog_name TEXT,
    author_name TEXT,
    photo_url TEXT,
    photo_urls TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    -- Legacy field for backward compatibility
    is_published BOOLEAN DEFAULT true,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteer opportunities table (standardize existing)
CREATE TABLE IF NOT EXISTS public.volunteer_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shelter_id UUID NOT NULL REFERENCES public.shelters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'animal_care' CHECK (category IN ('animal_care', 'medical', 'training', 'administration', 'events', 'transport', 'other')),
    difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    time_commitment TEXT,
    date DATE,
    start_time TIME,
    end_time TIME,
    location TEXT,
    max_volunteers INTEGER,
    current_volunteers INTEGER DEFAULT 0,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern TEXT,
    -- Legacy fields for backward compatibility
    opportunity_type TEXT DEFAULT 'general' CHECK (opportunity_type IN ('dog_walking', 'cleaning', 'events', 'transport', 'fostering', 'administrative', 'general')),
    requirements TEXT,
    schedule TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    is_active BOOLEAN DEFAULT true,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteer signups table (create after volunteer_opportunities exists)
CREATE TABLE IF NOT EXISTS public.volunteer_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id UUID NOT NULL REFERENCES public.volunteer_opportunities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'approved', 'declined', 'completed', 'confirmed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(opportunity_id, user_id)
);

-- Supply needs table (standardize existing)
CREATE TABLE IF NOT EXISTS public.supply_needs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shelter_id UUID NOT NULL REFERENCES public.shelters(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general' CHECK (category IN ('food', 'toys', 'medical', 'cleaning', 'bedding', 'equipment', 'general')),
    quantity_needed INTEGER,
    quantity_received INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    amazon_link TEXT,
    chewy_link TEXT,
    other_link TEXT,
    -- Legacy field for backward compatibility
    is_fulfilled BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. INTERACTION TABLES
-- =====================================================

-- Note: volunteer_signups table will be created after volunteer_opportunities table

-- Event RSVPs table (create new)
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

-- Supply donations table (create new)
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
-- 4. UPDATE EXISTING TABLES TO MATCH UNIFIED PATTERN
-- =====================================================

-- Add status columns where missing and update legacy fields
ALTER TABLE public.shelters ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));

-- Update shelter_stories to use unified status
ALTER TABLE public.shelter_stories ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));
UPDATE public.shelter_stories SET status = CASE 
    WHEN is_published = true THEN 'published' 
    ELSE 'draft' 
END WHERE status IS NULL;

-- Update volunteer_opportunities to use unified status
ALTER TABLE public.volunteer_opportunities ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'cancelled'));
UPDATE public.volunteer_opportunities SET status = CASE 
    WHEN is_active = true THEN 'active' 
    ELSE 'inactive' 
END WHERE status IS NULL;

-- Update supply_needs to use unified status
ALTER TABLE public.supply_needs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled'));
UPDATE public.supply_needs SET status = CASE 
    WHEN is_fulfilled = true THEN 'fulfilled' 
    ELSE 'active' 
END WHERE status IS NULL;

-- =====================================================
-- 5. CREATE UNIFIED CONTENT VIEW
-- =====================================================
CREATE OR REPLACE VIEW public.unified_content AS
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
-- 6. CREATE PERFORMANCE INDEXES
-- =====================================================

-- Core table indexes
CREATE INDEX IF NOT EXISTS idx_shelters_status ON public.shelters(status);
CREATE INDEX IF NOT EXISTS idx_shelters_access_code ON public.shelters(access_code);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_shelter_id ON public.profiles(shelter_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Content table indexes
CREATE INDEX IF NOT EXISTS idx_dogs_shelter_id ON public.dogs(shelter_id);
CREATE INDEX IF NOT EXISTS idx_dogs_status ON public.dogs(status);
CREATE INDEX IF NOT EXISTS idx_dogs_is_dog_of_week ON public.dogs(is_dog_of_week);

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
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_opportunity_id ON public.volunteer_signups(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_user_id ON public.volunteer_signups(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_status ON public.volunteer_signups(status);

CREATE INDEX IF NOT EXISTS idx_event_rsvps_event_id ON public.event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON public.event_rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_status ON public.event_rsvps(status);

CREATE INDEX IF NOT EXISTS idx_supply_donations_supply_need_id ON public.supply_donations(supply_need_id);
CREATE INDEX IF NOT EXISTS idx_supply_donations_user_id ON public.supply_donations(user_id);
CREATE INDEX IF NOT EXISTS idx_supply_donations_status ON public.supply_donations(status);

-- =====================================================
-- 7. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shelter_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_donations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. CREATE UNIFIED RLS POLICIES
-- =====================================================

-- Public read access for all content (unified pattern)
DROP POLICY IF EXISTS "Public can view active shelters" ON public.shelters;
CREATE POLICY "Public can view active shelters"
    ON public.shelters FOR SELECT
    TO anon, authenticated
    USING (status = 'active');

DROP POLICY IF EXISTS "Public can view all dogs" ON public.dogs;
CREATE POLICY "Public can view all dogs"
    ON public.dogs FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Public can view all events" ON public.events;
CREATE POLICY "Public can view all events"
    ON public.events FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Public can view published stories" ON public.shelter_stories;
CREATE POLICY "Public can view published stories"
    ON public.shelter_stories FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

DROP POLICY IF EXISTS "Public can view active opportunities" ON public.volunteer_opportunities;
CREATE POLICY "Public can view active opportunities"
    ON public.volunteer_opportunities FOR SELECT
    TO anon, authenticated
    USING (status = 'active');

DROP POLICY IF EXISTS "Public can view active supply needs" ON public.supply_needs;
CREATE POLICY "Public can view active supply needs"
    ON public.supply_needs FOR SELECT
    TO anon, authenticated
    USING (status = 'active');

-- Shelter management policies (unified pattern)
DROP POLICY IF EXISTS "Shelter staff can manage their dogs" ON public.dogs;
CREATE POLICY "Shelter staff can manage their dogs"
    ON public.dogs FOR ALL
    TO authenticated
    USING (
        shelter_id IN (
            SELECT shelter_id FROM public.profiles WHERE id = auth.uid() AND role IN ('shelter', 'admin')
        )
    );

DROP POLICY IF EXISTS "Shelter staff can manage their events" ON public.events;
CREATE POLICY "Shelter staff can manage their events"
    ON public.events FOR ALL
    TO authenticated
    USING (
        shelter_id IN (
            SELECT shelter_id FROM public.profiles WHERE id = auth.uid() AND role IN ('shelter', 'admin')
        )
    );

DROP POLICY IF EXISTS "Shelter staff can manage their stories" ON public.shelter_stories;
CREATE POLICY "Shelter staff can manage their stories"
    ON public.shelter_stories FOR ALL
    TO authenticated
    USING (
        shelter_id IN (
            SELECT shelter_id FROM public.profiles WHERE id = auth.uid() AND role IN ('shelter', 'admin')
        )
    );

DROP POLICY IF EXISTS "Shelter staff can manage their opportunities" ON public.volunteer_opportunities;
CREATE POLICY "Shelter staff can manage their opportunities"
    ON public.volunteer_opportunities FOR ALL
    TO authenticated
    USING (
        shelter_id IN (
            SELECT shelter_id FROM public.profiles WHERE id = auth.uid() AND role IN ('shelter', 'admin')
        )
    );

DROP POLICY IF EXISTS "Shelter staff can manage their supply needs" ON public.supply_needs;
CREATE POLICY "Shelter staff can manage their supply needs"
    ON public.supply_needs FOR ALL
    TO authenticated
    USING (
        shelter_id IN (
            SELECT shelter_id FROM public.profiles WHERE id = auth.uid() AND role IN ('shelter', 'admin')
        )
    );

-- User interaction policies
DROP POLICY IF EXISTS "Users can manage their signups" ON public.volunteer_signups;
CREATE POLICY "Users can manage their signups"
    ON public.volunteer_signups FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their RSVPs" ON public.event_rsvps;
CREATE POLICY "Users can manage their RSVPs"
    ON public.event_rsvps FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their donations" ON public.supply_donations;
CREATE POLICY "Users can manage their donations"
    ON public.supply_donations FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- Profile policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- =====================================================
-- 9. INSERT INITIAL SHELTER DATA
-- =====================================================
INSERT INTO public.shelters (name, access_code, state, website, description)
VALUES 
(
    'Furkids Animal Rescue & Shelters',
    'FURKIDS2025',
    'GA',
    'https://furkids.org',
    'Georgia''s largest no-kill animal rescue and shelters with multiple locations throughout Georgia.'
),
(
    'Hope for Hounds Rescue',
    'HOPEFORHOUNDS',
    'GA',
    'https://hopeforhounds.org',
    'Dedicated to rescuing and rehoming dogs in need throughout Georgia.'
)
ON CONFLICT (access_code) DO NOTHING;

-- =====================================================
-- 10. GRANT PERMISSIONS
-- =====================================================
GRANT SELECT ON public.shelters TO anon, authenticated;
GRANT SELECT ON public.dogs TO anon, authenticated;
GRANT SELECT ON public.events TO anon, authenticated;
GRANT SELECT ON public.shelter_stories TO anon, authenticated;
GRANT SELECT ON public.volunteer_opportunities TO anon, authenticated;
GRANT SELECT ON public.supply_needs TO anon, authenticated;
GRANT SELECT ON public.unified_content TO anon, authenticated;

GRANT ALL ON public.volunteer_signups TO authenticated;
GRANT ALL ON public.event_rsvps TO authenticated;
GRANT ALL ON public.supply_donations TO authenticated;

-- =====================================================
-- 10. CREATE HELPER FUNCTIONS
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

-- =====================================================
-- 11. VERIFICATION QUERIES
-- =====================================================
-- Uncomment these to test the schema:

-- Check all tables exist with correct structure
-- SELECT table_name, column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('dogs', 'events', 'shelter_stories', 'volunteer_opportunities', 'supply_needs')
-- ORDER BY table_name, ordinal_position;

-- Check unified content view
-- SELECT content_type, COUNT(*) FROM public.unified_content GROUP BY content_type;

-- Check indexes exist
-- SELECT schemaname, tablename, indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename;

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;