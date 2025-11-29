-- =====================================================
-- Connect 4 Paws - Dual Dashboard Access Migration
-- =====================================================
-- Run this in your Supabase SQL Editor to enable dual access
-- 
-- LOGIC:
-- - ALL users are automatically community members (can access community dashboard)
-- - When a user enters a shelter access code, they become SHELTER role
-- - Shelter users can access BOTH community AND shelter dashboards
-- - This is handled in the frontend routing, not by changing the role
--
-- This migration ensures existing shelter users maintain their access
-- and clarifies that "shelter" role means "shelter + community" access
-- =====================================================

-- 1. Add a comment to the profiles table explaining the role logic
COMMENT ON COLUMN public.profiles.role IS 
'User role: community (default), volunteer, shelter, admin. 
Note: ALL users have community access regardless of role.
shelter/admin roles have BOTH shelter AND community dashboard access.';

-- 2. Update the handle_new_user function to ensure all new users start as community
-- (This should already be the case, but let's make sure)
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
        'community'  -- Everyone starts as community member
    );
    RETURN NEW;
END;
$$;

-- 3. The validate_shelter_access_code function already upgrades users to 'shelter' role
-- Shelter role users can access BOTH dashboards (handled in frontend)
-- No changes needed to this function

-- 4. Verify existing users have proper roles
-- This query shows current user distribution (run to check, doesn't modify anything)
-- SELECT role, COUNT(*) FROM profiles GROUP BY role;

-- =====================================================
-- SUMMARY OF ACCESS LOGIC:
-- =====================================================
-- Role: community  -> Can access: Community Dashboard only
-- Role: volunteer  -> Can access: Community Dashboard only  
-- Role: shelter    -> Can access: Community Dashboard + Shelter Dashboard
-- Role: admin      -> Can access: Community Dashboard + Shelter Dashboard
-- =====================================================
