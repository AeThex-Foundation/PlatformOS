/**
 * Creator Directory API Routes
 * Foundation "Hall of Fame" - Public showcase of opted-in creators
 * 
 * Privacy-First: Only shows users who have opted in via profile settings
 * Requirements: avatar, username, bio (completed profile)
 */

import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Valid filter options
const VALID_ARMS = ['FOUNDATION', 'GAMEFORGE', 'ETHOS', 'LABS'];
const VALID_ROLES = ['Architect', 'Mentor', 'Community Member'];
const VALID_SORT_OPTIONS = ['last_active', 'join_date', 'name'];

interface CreatorProfile {
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  arms: string[];
  roles: string[];
  is_architect: boolean;
  last_active_at: string;
  created_at: string;
}

/**
 * GET /api/creators
 * 
 * Query params:
 * - arm: Filter by arm affiliation (FOUNDATION, GAMEFORGE, ETHOS, LABS)
 * - role: Filter by role (Architect, Mentor, Community Member)
 * - sort: Sort order (last_active, join_date, name) - default: last_active
 * - featured: Only return Architects (for Featured section)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { arm, role, sort = 'last_active', featured } = req.query;

    // Build query - only show opted-in users with completed profiles
    let query = supabaseAdmin
      .from('user_profiles')
      .select('username, full_name, avatar_url, bio, arms, roles, last_active_at, created_at')
      .eq('show_in_creator_directory', true)
      .not('username', 'is', null)
      .not('avatar_url', 'is', null)
      .not('bio', 'is', null);

    // Filter by arm affiliation
    if (arm && typeof arm === 'string' && VALID_ARMS.includes(arm.toUpperCase())) {
      query = query.contains('arms', [arm.toUpperCase()]);
    }

    // Filter by role
    if (role && typeof role === 'string' && VALID_ROLES.includes(role)) {
      query = query.contains('roles', [role]);
    }

    // Featured Architects only (for "Hall of Fame" section)
    if (featured === 'true') {
      query = query.contains('roles', ['Architect']);
    }

    // Apply sorting
    if (sort === 'last_active') {
      query = query.order('last_active_at', { ascending: false });
    } else if (sort === 'join_date') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'name') {
      query = query.order('full_name', { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Creator directory query error:', error);
      return res.status(500).json({ error: 'Failed to fetch creator directory' });
    }

    // Transform data to include is_architect flag
    const creators: CreatorProfile[] = (data || []).map((profile: any) => ({
      username: profile.username,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      bio: profile.bio?.substring(0, 140) || '', // Truncate to 140 chars
      arms: profile.arms || [],
      roles: profile.roles || [],
      is_architect: (profile.roles || []).includes('Architect'),
      last_active_at: profile.last_active_at,
      created_at: profile.created_at,
    }));

    // Cache for 5 minutes (public showcase, infrequently updated)
    res.setHeader('Cache-Control', 'public, max-age=300');
    
    return res.json({
      creators,
      count: creators.length,
      filters: {
        arm: arm || null,
        role: role || null,
        sort: sort || 'last_active',
        featured: featured === 'true',
      },
    });
  } catch (err) {
    console.error('Creator directory error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/creators/:username
 * 
 * Get a single creator profile by username
 */
router.get('/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('username, full_name, avatar_url, bio, arms, roles, last_active_at, created_at')
      .eq('username', username.toLowerCase())
      .eq('show_in_creator_directory', true)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    const creator: CreatorProfile = {
      username: data.username,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      bio: data.bio || '',
      arms: data.arms || [],
      roles: data.roles || [],
      is_architect: (data.roles || []).includes('Architect'),
      last_active_at: data.last_active_at,
      created_at: data.created_at,
    };

    res.setHeader('Cache-Control', 'public, max-age=60');
    return res.json(creator);
  } catch (err) {
    console.error('Creator profile error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
