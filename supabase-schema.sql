-- =====================================================
-- Connect 4 Paws - Supabase Database Schema
-- =====================================================
-- Run this ONCE in your Supabase SQL Editor to set up the database

-- =====================================================
-- 1. SHELTERS TABLE (Create first - no dependencies)
-- =====================================================
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.shelters ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. USER PROFILES TABLE
-- =====================================================
-- ACCESS LOGIC:
-- - ALL users are community members (can access community dashboard)
-- - Role 'community' = community dashboard only
-- - Role 'volunteer' = community dashboard only
-- - Role 'shelter' = BOTH community AND shelter dashboards
-- - Role 'admin' = BOTH community AND shelter dashboards
-- When a user enters a shelter access code, they upgrade to 'shelter' role
-- but KEEP their community access (handled in frontend routing)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'community' CHECK (role IN ('community', 'volunteer', 'shelter', 'admin')),
    shelter_id UUID REFERENCES public.shelters(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies (DROP first to allow re-running this script)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- This policy allows the function to update profiles
DROP POLICY IF EXISTS "Function can update profiles" ON public.profiles;
CREATE POLICY "Function can update profiles"
    ON public.profiles FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- 3. INITIAL SHELTER DATA
-- =====================================================
INSERT INTO public.shelters (name, access_code, city, state, description)
VALUES (
    'Campbell High School Hope for Hounds',
    'HOPEFORHOUNDS',
    'Campbell',
    'CA',
    'Student-led initiative helping dogs find their forever homes.'
)
ON CONFLICT (access_code) DO NOTHING;

-- =====================================================
-- 4. AUTO-CREATE PROFILE ON USER SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'community'
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =====================================================
-- 5. SHELTER ACCESS CODE VALIDATION FUNCTION
-- This is the key function that assigns shelter role
-- =====================================================
CREATE OR REPLACE FUNCTION public.validate_shelter_access_code(
    p_code TEXT,
    p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_shelter_id UUID;
    v_shelter_name TEXT;
BEGIN
    -- Find shelter by access code
    SELECT id, name INTO v_shelter_id, v_shelter_name
    FROM shelters
    WHERE access_code = p_code;

    -- If code not found, return error
    IF v_shelter_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Invalid access code'
        );
    END IF;

    -- Update user profile to shelter role
    UPDATE profiles
    SET 
        role = 'shelter',
        shelter_id = v_shelter_id,
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Check if update worked
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Profile not found'
        );
    END IF;

    -- Success!
    RETURN json_build_object(
        'success', true,
        'message', 'Access granted',
        'shelter_id', v_shelter_id,
        'shelter_name', v_shelter_name
    );
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.validate_shelter_access_code(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_shelter_access_code(TEXT, UUID) TO anon;

-- =====================================================
-- 6. SHELTERS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view shelters" ON public.shelters;
CREATE POLICY "Anyone can view shelters"
    ON public.shelters FOR SELECT
    TO authenticated
    USING (true);

-- =====================================================
-- 7. INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_shelters_access_code ON public.shelters(access_code);
