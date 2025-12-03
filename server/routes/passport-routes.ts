/**
 * Passport Routes
 * API endpoints for creator passports and project showcases
 * Used by *.aethex.me and *.aethex.space subdomains
 */

import { Router, Request, Response } from 'express';
import { passportStorage } from '../storage/passport-storage';
import { supabaseAdmin } from '../oauth/oauth-service';

const router = Router();

/**
 * GET /api/passport/subdomain-data/:slug
 * Get creator passport by username slug (for *.aethex.me subdomains)
 * Returns data in the format expected by SubdomainPassport component
 */
router.get('/subdomain-data/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('username', slug.toLowerCase())
      .single();
    
    if (error || !profile) {
      return res.status(404).json({ error: "User not found", type: "creator" });
    }
    
    const { data: achievements } = await supabaseAdmin
      .from('user_achievements')
      .select(`
        achievement_id,
        achievements (
          id,
          name,
          description,
          icon,
          xp_reward
        )
      `)
      .eq('user_id', profile.id);

    const userWithAchievements = {
      ...profile,
      achievements: (achievements || []).map((ua: any) => ua.achievements).filter(Boolean),
      interests: profile.interests || [],
      linkedProviders: [],
    };
    
    res.json({
      type: "creator",
      user: userWithAchievements,
      domain: "aethex.me",
    });
  } catch (error) {
    console.error("[Passport] Failed to fetch subdomain data:", error);
    res.status(500).json({ error: "Failed to fetch passport" });
  }
});

/**
 * GET /api/passport/project-data/:slug
 * Get project/group data by slug (for *.aethex.space subdomains)
 */
router.get('/project-data/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const { data: group, error } = await supabaseAdmin
      .from('groups')
      .select('*')
      .eq('slug', slug.toLowerCase())
      .single();
    
    if (error || !group) {
      return res.status(404).json({ error: "Group not found", type: "group" });
    }
    
    const { data: members } = await supabaseAdmin
      .from('group_members')
      .select(`
        user_id,
        role,
        joined_at,
        user_profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('group_id', group.id);

    const { data: projects } = await supabaseAdmin
      .from('projects')
      .select('id, title, slug, description, image_url, created_at')
      .eq('group_id', group.id);

    const groupWithMembers = {
      ...group,
      memberCount: members?.length || 0,
      members: (members || []).map((m: any) => ({
        userId: m.user_id,
        role: m.role,
        joinedAt: m.joined_at,
        user: m.user_profiles,
      })),
    };
    
    res.json({
      type: "group",
      group: groupWithMembers,
      projects: projects || [],
      domain: "aethex.space",
    });
  } catch (error) {
    console.error("[Passport] Failed to fetch project data:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

/**
 * GET /api/passport/directory
 * Get all passport holders for the directory page
 */
router.get('/directory', async (req: Request, res: Response) => {
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from('user_profiles')
      .select('id, username, full_name, avatar_url, bio, is_verified, level, total_xp, primary_role, realm_alignment')
      .eq('show_in_creator_directory', true)
      .order('total_xp', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error("[Passport] Failed to fetch directory:", error);
      return res.status(500).json({ error: "Failed to fetch directory" });
    }
    
    res.json({ members: profiles || [] });
  } catch (error) {
    console.error("[Passport] Failed to fetch directory:", error);
    res.status(500).json({ error: "Failed to fetch directory" });
  }
});

/**
 * GET /api/passport/:slug
 * Get creator passport by username slug (for aethex.foundation/:username route)
 * Returns format expected by Passport.tsx component
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    // Fetch profile directly from Supabase in the format Passport.tsx expects
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('username', slug.toLowerCase())
      .single();
    
    if (error || !profile) {
      console.log(`[Passport] User not found: ${slug}`);
      return res.status(404).json({ error: "Profile not found" });
    }
    
    // Fetch achievement count
    const { count: badgeCount } = await supabaseAdmin
      .from('user_achievements')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id);
    
    // Return in the format Passport.tsx expects (PublicPassportProfile)
    res.json({
      id: profile.id,
      username: profile.username,
      full_name: profile.full_name || profile.username,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      location: profile.location,
      website_url: profile.website_url,
      github_url: profile.github_url,
      twitter_url: profile.twitter_url,
      linkedin_url: profile.linkedin_url,
      created_at: profile.created_at,
      total_xp: profile.total_xp || 0,
      level: profile.level || 1,
      badge_count: badgeCount || 0,
      verified: profile.is_verified || false,
    });
  } catch (error) {
    console.error("[Passport] Failed to fetch passport:", error);
    res.status(500).json({ error: "Failed to fetch passport" });
  }
});

/**
 * GET /api/passport
 * Auto-detect route type based on host header
 * Returns creator data for *.aethex.me, project data for *.aethex.space
 */
router.get('/', async (req: Request, res: Response) => {
  const rawHost = req.headers.host || "";
  const host = rawHost.split(":")[0].toLowerCase();
  
  if (host.endsWith(".aethex.me")) {
    const slug = host.replace(".aethex.me", "");
    if (!slug || slug.includes(".")) {
      return res.status(400).json({ error: "Invalid subdomain", type: "creator" });
    }
    const creator = await passportStorage.getCreatorBySlug(slug);
    if (creator) {
      return res.json({ type: "creator", data: creator });
    }
    return res.status(404).json({ error: "Creator not found", type: "creator", slug });
  }
  
  if (host.endsWith(".aethex.space")) {
    const slug = host.replace(".aethex.space", "");
    if (!slug || slug.includes(".")) {
      return res.status(400).json({ error: "Invalid subdomain", type: "project" });
    }
    const project = await passportStorage.getProjectBySlug(slug);
    if (project) {
      return res.json({ type: "project", data: project });
    }
    return res.status(404).json({ error: "Project not found", type: "project", slug });
  }
  
  res.json({ type: "landing", message: "AeThex Passport Engine" });
});

export default router;
