-- =====================================================
-- Connect 4 Paws - Additional Schema for New Features
-- =====================================================
-- Run this AFTER the main schema to add new feature tables

-- =====================================================
-- 1. DOGS TABLE - For shelter-posted dogs
-- =====================================================
CREATE TABLE IF NOT EXISTS public.dogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shelter_id UUID REFERENCES public.shelters(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    breed TEXT NOT NULL,
    age TEXT NOT NULL,
    age_category TEXT NOT NULL CHECK (age_category IN ('puppy', 'young', 'adult', 'senior')),
    size TEXT NOT NULL CHECK (size IN ('small', 'medium', 'large')),
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    temperament TEXT[] DEFAULT '{}',
    description TEXT,
    medical_info TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'foster', 'pending', 'adopted')),
    is_urgent BOOLEAN DEFAULT false,
    is_dog_of_week BOOLEAN DEFAULT false,
    photo_urls TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;

-- Dogs policies
CREATE POLICY "Anyone can view available dogs"
    ON public.dogs FOR SELECT
    USING (status IN ('available', 'foster'));

CREATE POLICY "Shelter staff can manage their dogs"
    ON public.dogs FOR ALL
    USING (
        shelter_id IN (
            SELECT shelter_id FROM public.profiles WHERE id = auth.uid()
        )
    );

-- =====================================================
-- 2. SUPPLY NEEDS TABLE - Shelter wishlists
-- =====================================================
CREATE TABLE IF NOT EXISTS public.supply_needs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shelter_id UUID REFERENCES public.shelters(id) ON DELETE CASCADE NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('food', 'medical', 'bedding', 'toys', 'cleaning', 'other')),
    quantity_needed INTEGER DEFAULT 1,
    quantity_received INTEGER DEFAULT 0,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    description TEXT,
    amazon_link TEXT,
    chewy_link TEXT,
    other_link TEXT,
    is_fulfilled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.supply_needs ENABLE ROW LEVEL SECURITY;

-- Supply needs policies
CREATE POLICY "Anyone can view supply needs"
    ON public.supply_needs FOR SELECT
    USING (is_fulfilled = false);

CREATE POLICY "Shelter staff can manage their supply needs"
    ON public.supply_needs FOR ALL
    USING (
        shelter_id IN (
            SELECT shelter_id FROM public.profiles WHERE id = auth.uid()
        )
    );

-- =====================================================
-- 3. VOLUNTEER OPPORTUNITIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.volunteer_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shelter_id UUID REFERENCES public.shelters(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('animal_care', 'medical', 'training', 'administration', 'events', 'transport', 'other')),
    difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    time_commitment TEXT NOT NULL,
    date DATE,
    start_time TIME,
    end_time TIME,
    location TEXT,
    max_volunteers INTEGER,
    current_volunteers INTEGER DEFAULT 0,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;

-- Volunteer opportunities policies
CREATE POLICY "Anyone can view active opportunities"
    ON public.volunteer_opportunities FOR SELECT
    USING (is_active = true);

CREATE POLICY "Shelter staff can manage their opportunities"
    ON public.volunteer_opportunities FOR ALL
    USING (
        shelter_id IN (
            SELECT shelter_id FROM public.profiles WHERE id = auth.uid()
        )
    );

-- =====================================================
-- 4. VOLUNTEER SIGNUPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.volunteer_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id UUID REFERENCES public.volunteer_opportunities(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'signed_up' CHECK (status IN ('signed_up', 'confirmed', 'completed', 'cancelled')),
    hours_logged DECIMAL(5,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(opportunity_id, user_id)
);

ALTER TABLE public.volunteer_signups ENABLE ROW LEVEL SECURITY;

-- Volunteer signups policies
CREATE POLICY "Users can view their own signups"
    ON public.volunteer_signups FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own signups"
    ON public.volunteer_signups FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Shelter staff can view signups for their opportunities"
    ON public.volunteer_signups FOR SELECT
    USING (
        opportunity_id IN (
            SELECT vo.id FROM public.volunteer_opportunities vo
            JOIN public.profiles p ON vo.shelter_id = p.shelter_id
            WHERE p.id = auth.uid()
        )
    );

-- =====================================================
-- 5. SHELTER STORIES/UPDATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.shelter_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shelter_id UUID REFERENCES public.shelters(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    story_type TEXT NOT NULL DEFAULT 'update' CHECK (story_type IN ('update', 'success_story', 'urgent_need', 'event', 'thank_you')),
    dog_id UUID REFERENCES public.dogs(id) ON DELETE SET NULL,
    photo_urls TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.shelter_stories ENABLE ROW LEVEL SECURITY;

-- Shelter stories policies
CREATE POLICY "Anyone can view published stories"
    ON public.shelter_stories FOR SELECT
    USING (is_published = true);

CREATE POLICY "Shelter staff can manage their stories"
    ON public.shelter_stories FOR ALL
    USING (
        shelter_id IN (
            SELECT shelter_id FROM public.profiles WHERE id = auth.uid()
        )
    );

-- =====================================================
-- 6. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_dogs_shelter ON public.dogs(shelter_id);
CREATE INDEX IF NOT EXISTS idx_dogs_status ON public.dogs(status);
CREATE INDEX IF NOT EXISTS idx_dogs_is_urgent ON public.dogs(is_urgent);
CREATE INDEX IF NOT EXISTS idx_dogs_is_dog_of_week ON public.dogs(is_dog_of_week);

CREATE INDEX IF NOT EXISTS idx_supply_needs_shelter ON public.supply_needs(shelter_id);
CREATE INDEX IF NOT EXISTS idx_supply_needs_priority ON public.supply_needs(priority);
CREATE INDEX IF NOT EXISTS idx_supply_needs_fulfilled ON public.supply_needs(is_fulfilled);

CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_shelter ON public.volunteer_opportunities(shelter_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_active ON public.volunteer_opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_date ON public.volunteer_opportunities(date);

CREATE INDEX IF NOT EXISTS idx_volunteer_signups_opportunity ON public.volunteer_signups(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_user ON public.volunteer_signups(user_id);

CREATE INDEX IF NOT EXISTS idx_shelter_stories_shelter ON public.shelter_stories(shelter_id);
CREATE INDEX IF NOT EXISTS idx_shelter_stories_featured ON public.shelter_stories(is_featured);
CREATE INDEX IF NOT EXISTS idx_shelter_stories_type ON public.shelter_stories(story_type);

-- =====================================================
-- 7. UPDATE SHELTERS TABLE WITH ADDITIONAL FIELDS
-- =====================================================
ALTER TABLE public.shelters 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS needs_help BOOLEAN DEFAULT true;
