-- Creator Directory Database Schema
-- Run this in Supabase Dashboard > SQL Editor

-- Add Creator Directory fields to user_profiles table

-- Opt-in toggle (default: false for privacy - KND-011 compliance)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS show_in_creator_directory BOOLEAN NOT NULL DEFAULT false;

-- Arm affiliations (GAMEFORGE, ETHOS, LABS, FOUNDATION)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS arms TEXT[] DEFAULT '{}';

-- Roles (Architect, Mentor, Community Member)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS roles TEXT[] DEFAULT '{}';

-- Last active timestamp (for sorting)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add index for creator directory queries (performance optimization)
CREATE INDEX IF NOT EXISTS idx_user_profiles_show_in_directory 
ON public.user_profiles(show_in_creator_directory) 
WHERE show_in_creator_directory = true;

-- Add index for last_active_at sorting
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_active 
ON public.user_profiles(last_active_at DESC);

-- Documentation comments
COMMENT ON COLUMN public.user_profiles.show_in_creator_directory IS 'Opt-in toggle for public Foundation Creator Directory (default: false for privacy)';
COMMENT ON COLUMN public.user_profiles.arms IS 'Arm affiliations: GAMEFORGE, ETHOS, LABS, FOUNDATION';
COMMENT ON COLUMN public.user_profiles.roles IS 'Roles: Architect, Mentor, Community Member';

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('show_in_creator_directory', 'arms', 'roles', 'last_active_at');
