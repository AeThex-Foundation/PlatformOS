/**
 * Passport API Endpoint
 * Public profile endpoint for Foundation Passport users
 * 
 * GET /api/passport/:username - Returns public profile data
 */

import { Router, Request, Response } from 'express';
import { adminSupabase } from '../supabase';

const router = Router();

// Reserved usernames that cannot be used for profiles
const RESERVED_USERNAMES = [
  'admin',
  'api',
  'about',
  'auth',
  'blog',
  'contact',
  'dashboard',
  'ethics-council',
  'foundation',
  'hub',
  'login',
  'logout',
  'oauth',
  'onboarding',
  'passport',
  'profile',
  'settings',
  'signup',
  'staff',
  'support',
  'www',
  // Add more reserved words as needed
];

/**
 * Check if a username is reserved
 */
export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.includes(username.toLowerCase());
}

/**
 * Public profile data shape
 */
export interface PublicPassportProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  created_at: string;
  // Foundation-specific fields
  total_xp?: number;
  level?: number;
  badge_count?: number;
  verified?: boolean;
}

/**
 * GET /api/passport/:username
 * 
 * Returns public profile data for a user
 * 
 * Response:
 * - 200: Profile found
 * - 404: User not found or username is reserved
 * - 500: Server error
 */
router.get('/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    // Validate username format
    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        error: 'invalid_username',
        message: 'Username is required',
      });
    }

    // Normalize username (lowercase, trim)
    const normalizedUsername = username.trim().toLowerCase();

    // Validate username format (alphanumeric, underscores, hyphens, 3-30 chars)
    const usernameRegex = /^[a-z0-9_-]{3,30}$/;
    if (!usernameRegex.test(normalizedUsername)) {
      return res.status(400).json({
        error: 'invalid_username',
        message: 'Username must be 3-30 characters (letters, numbers, _, -)',
      });
    }

    // Check if username is reserved
    if (isReservedUsername(normalizedUsername)) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Profile not found',
      });
    }

    // Fetch user profile from Supabase (include id for achievement query)
    const { data: profile, error } = await adminSupabase
      .from('user_profiles')
      .select(`
        id,
        username,
        full_name,
        avatar_url,
        bio,
        location,
        website_url,
        github_url,
        twitter_url,
        linkedin_url,
        created_at,
        total_xp,
        level
      `)
      .eq('username', normalizedUsername)
      .single();

    if (error || !profile) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Profile not found',
      });
    }

    // Fetch achievement count
    const { count: badgeCount } = await adminSupabase
      .from('user_achievements')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', profile.id);

    // Build public profile response
    const publicProfile: PublicPassportProfile = {
      id: profile.id as string,
      username: profile.username as string,
      full_name: profile.full_name as string,
      avatar_url: profile.avatar_url as string | null,
      bio: profile.bio as string | null,
      location: profile.location as string | null,
      website_url: profile.website_url as string | null,
      github_url: profile.github_url as string | null,
      twitter_url: profile.twitter_url as string | null,
      linkedin_url: profile.linkedin_url as string | null,
      created_at: profile.created_at as string,
      total_xp: (profile.total_xp as number) || 0,
      level: (profile.level as number) || 1,
      badge_count: badgeCount || 0,
      verified: false, // TODO: Add verification system
    };

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 'public, max-age=300');
    
    return res.json(publicProfile);

  } catch (error) {
    console.error('Passport API error:', error);
    return res.status(500).json({
      error: 'server_error',
      message: 'Failed to fetch profile',
    });
  }
});

export default router;
