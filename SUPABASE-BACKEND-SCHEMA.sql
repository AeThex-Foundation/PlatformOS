-- Guardian's Hub Backend Schema Migration
-- Run this in Supabase Dashboard > SQL Editor
-- Creates tables for: Achievements, Workshops, Resources, Bounties

-- =============================================================================
-- ACHIEVEMENTS SYSTEM
-- =============================================================================

-- Master achievements table (all available achievements)
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id VARCHAR(100) UNIQUE NOT NULL, -- e.g., "first-login", "workshop-attendee"
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL, -- Lucide icon name
  category VARCHAR(50) NOT NULL, -- "milestone", "contribution", "special"
  xp_reward INTEGER NOT NULL DEFAULT 0,
  rarity VARCHAR(20) NOT NULL DEFAULT 'common', -- common, rare, epic, legendary
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for achievements
CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON public.achievements(rarity);

-- Note: user_achievements table already exists (tracks which users earned which achievements)

-- =============================================================================
-- WORKSHOPS SYSTEM
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  instructor_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  instructor_name VARCHAR(200) NOT NULL, -- Denormalized for performance
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
  capacity INTEGER NOT NULL DEFAULT 50,
  registered_count INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming', -- upcoming, live, completed, cancelled
  meeting_url TEXT, -- Zoom/Meet link (visible to registered users only)
  recording_url TEXT, -- For completed workshops
  tags TEXT[] DEFAULT '{}', -- ["React", "OAuth", "Database"]
  xp_reward INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop registrations
CREATE TABLE IF NOT EXISTS public.workshop_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attended BOOLEAN DEFAULT false,
  attendance_marked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(workshop_id, user_id)
);

-- Indexes for workshops
CREATE INDEX IF NOT EXISTS idx_workshops_status ON public.workshops(status);
CREATE INDEX IF NOT EXISTS idx_workshops_start_time ON public.workshops(start_time);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_user ON public.workshop_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_workshop ON public.workshop_registrations(workshop_id);

-- =============================================================================
-- RESOURCES LIBRARY
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- "guide", "template", "asset", "whitepaper"
  file_url TEXT NOT NULL, -- Supabase Storage URL or external link
  file_type VARCHAR(50) NOT NULL, -- "pdf", "docx", "zip", "figma", etc.
  file_size_bytes BIGINT, -- File size in bytes
  thumbnail_url TEXT, -- Preview image
  tags TEXT[] DEFAULT '{}',
  download_count INTEGER NOT NULL DEFAULT 0,
  published_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT false
);

-- Resource downloads tracking
CREATE TABLE IF NOT EXISTS public.resource_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL, -- NULL if anonymous
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET, -- For rate limiting
  user_agent TEXT
);

-- Indexes for resources
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON public.resources(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource ON public.resource_downloads(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_user ON public.resource_downloads(user_id);

-- =============================================================================
-- BOUNTY BOARD / COMMUNITY QUESTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., "QUEST-001"
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(20) NOT NULL, -- "Beginner", "Intermediate", "Advanced"
  status VARCHAR(20) NOT NULL DEFAULT 'open', -- open, in_progress, completed, closed
  reward_usd INTEGER NOT NULL DEFAULT 0, -- Dollar amount
  xp_reward INTEGER NOT NULL DEFAULT 0,
  project VARCHAR(100) NOT NULL, -- "Foundation", "Corp", "GameForge", etc.
  skills TEXT[] DEFAULT '{}', -- Required skills
  time_estimate VARCHAR(50), -- "2-4 hours", "1-2 weeks"
  posted_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  applicant_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  deadline TIMESTAMP WITH TIME ZONE
);

-- Bounty applications
CREATE TABLE IF NOT EXISTS public.bounty_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID NOT NULL REFERENCES public.bounties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected, withdrawn
  message TEXT NOT NULL, -- Application message
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  UNIQUE(bounty_id, user_id)
);

-- Indexes for bounties
CREATE INDEX IF NOT EXISTS idx_bounties_status ON public.bounties(status);
CREATE INDEX IF NOT EXISTS idx_bounties_difficulty ON public.bounties(difficulty);
CREATE INDEX IF NOT EXISTS idx_bounties_project ON public.bounties(project);
CREATE INDEX IF NOT EXISTS idx_bounty_applications_user ON public.bounty_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_bounty_applications_bounty ON public.bounty_applications(bounty_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bounty_applications ENABLE ROW LEVEL SECURITY;

-- Achievements: Public read, admin write
CREATE POLICY "Achievements are publicly readable" ON public.achievements
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage achievements" ON public.achievements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
      AND ('owner' = ANY(roles) OR 'admin' = ANY(roles) OR 'founder' = ANY(roles))
    )
  );

-- Workshops: Public read, instructors/admins write
CREATE POLICY "Workshops are publicly readable" ON public.workshops
  FOR SELECT USING (true);

CREATE POLICY "Instructors and admins can manage workshops" ON public.workshops
  FOR ALL USING (
    auth.uid() = instructor_id OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
      AND ('owner' = ANY(roles) OR 'admin' = ANY(roles) OR 'instructor' = ANY(roles))
    )
  );

-- Workshop registrations: Users can view own, admins can view all
CREATE POLICY "Users can view own registrations" ON public.workshop_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can register for workshops" ON public.workshop_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel own registrations" ON public.workshop_registrations
  FOR DELETE USING (auth.uid() = user_id);

-- Resources: Public read, publishers/admins write
CREATE POLICY "Resources are publicly readable" ON public.resources
  FOR SELECT USING (true);

CREATE POLICY "Publishers and admins can manage resources" ON public.resources
  FOR ALL USING (
    auth.uid() = published_by OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
      AND ('owner' = ANY(roles) OR 'admin' = ANY(roles) OR 'publisher' = ANY(roles))
    )
  );

-- Resource downloads: Users can view own, public insert
CREATE POLICY "Users can view own downloads" ON public.resource_downloads
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can record downloads" ON public.resource_downloads
  FOR INSERT WITH CHECK (true);

-- Bounties: Public read, posters/admins write
CREATE POLICY "Bounties are publicly readable" ON public.bounties
  FOR SELECT USING (true);

CREATE POLICY "Users can create bounties" ON public.bounties
  FOR INSERT WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Bounty owners and admins can manage" ON public.bounties
  FOR UPDATE USING (
    auth.uid() = posted_by OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
      AND ('owner' = ANY(roles) OR 'admin' = ANY(roles))
    )
  );

-- Bounty applications: Users can view own, bounty owners can view all for their bounties
CREATE POLICY "Users can view own applications" ON public.bounty_applications
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.bounties
      WHERE id = bounty_applications.bounty_id
      AND posted_by = auth.uid()
    )
  );

CREATE POLICY "Users can apply to bounties" ON public.bounty_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- SEED DATA (Sample achievements, workshops, resources, bounties)
-- =============================================================================

-- Sample achievements
INSERT INTO public.achievements (achievement_id, title, description, icon, category, xp_reward, rarity) VALUES
  ('first-login', 'First Login', 'Welcome to the Foundation!', 'LogIn', 'milestone', 10, 'common'),
  ('profile-complete', 'Profile Complete', 'Completed your Passport profile', 'User', 'milestone', 25, 'common'),
  ('workshop-attendee', 'Workshop Attendee', 'Attended your first Foundation workshop', 'GraduationCap', 'contribution', 50, 'rare'),
  ('bounty-hunter', 'Bounty Hunter', 'Completed your first bounty quest', 'Trophy', 'contribution', 100, 'epic'),
  ('architect', 'Architect', 'Achieved Architect status', 'Shield', 'special', 500, 'legendary'),
  ('community-champion', 'Community Champion', 'Made 50+ contributions to the community', 'Heart', 'contribution', 250, 'epic')
ON CONFLICT (achievement_id) DO NOTHING;

-- Sample workshops (upcoming)
INSERT INTO public.workshops (title, description, instructor_name, start_time, end_time, capacity, tags, xp_reward) VALUES
  ('OAuth 2.0 Deep Dive', 'Learn how Foundation implements OAuth 2.0 for Passport authentication', 'Sarah Chen', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 2 hours', 100, ARRAY['OAuth', 'Security', 'Backend'], 100),
  ('React Performance Optimization', 'Techniques for building high-performance React applications', 'Marcus Johnson', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days 1.5 hours', 75, ARRAY['React', 'Performance', 'Frontend'], 75)
ON CONFLICT DO NOTHING;

-- Sample resources
INSERT INTO public.resources (title, description, category, file_url, file_type, tags) VALUES
  ('Foundation Whitepaper', 'Comprehensive overview of the AeThex Foundation governance model', 'whitepaper', 'https://example.com/whitepaper.pdf', 'pdf', ARRAY['Governance', 'Whitepaper']),
  ('React Component Library', 'Reusable Foundation-branded React components', 'template', 'https://example.com/components.zip', 'zip', ARRAY['React', 'Components', 'Frontend']),
  ('OAuth Integration Guide', 'Step-by-step guide for integrating with Foundation Passport', 'guide', 'https://example.com/oauth-guide.pdf', 'pdf', ARRAY['OAuth', 'Integration', 'Backend'])
ON CONFLICT DO NOTHING;

-- Sample bounties
INSERT INTO public.bounties (bounty_id, title, description, difficulty, reward_usd, xp_reward, project, skills, time_estimate, posted_by) VALUES
  ('QUEST-001', 'Mobile App Prototype', 'Design and prototype a mobile companion app for Guardian''s Hub', 'Advanced', 500, 200, 'Foundation', ARRAY['React Native', 'UI/UX', 'Figma'], '1-2 weeks', (SELECT id FROM public.user_profiles LIMIT 1)),
  ('QUEST-002', 'Documentation Improvements', 'Improve API documentation with interactive examples', 'Beginner', 100, 50, 'Foundation', ARRAY['Technical Writing', 'Markdown'], '4-6 hours', (SELECT id FROM public.user_profiles LIMIT 1))
ON CONFLICT (bounty_id) DO NOTHING;

-- Verification query
SELECT 
  'achievements' as table_name, COUNT(*) as row_count FROM public.achievements
UNION ALL
SELECT 'workshops', COUNT(*) FROM public.workshops
UNION ALL
SELECT 'resources', COUNT(*) FROM public.resources
UNION ALL
SELECT 'bounties', COUNT(*) FROM public.bounties;
