/**
 * Profile Management API Routes
 * Handles user profile updates including Creator Directory opt-in
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

/**
 * GET /api/profile/:username
 * 
 * Get a user's public profile by username
 * Returns profile data for public viewing
 */
router.get('/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (fetchError || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.json(profile);
  } catch (err) {
    console.error('Error fetching profile:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/profile
 * 
 * Update the authenticated user's profile
 * Requires authentication
 */
router.put('/', async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authMiddleware
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const allowedFields = [
      'full_name',
      'bio',
      'location',
      'user_type',
      'experience_level',
      'github_url',
      'linkedin_url',
      'twitter_url',
      'portfolio_url',
      'youtube_url',
      'twitch_url',
      'skills_detailed',
      'languages',
      'work_experience',
      'portfolio_items',
    ];

    const updates: any = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    updates.updated_at = new Date().toISOString();

    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    return res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/profile/creator-directory
 * 
 * Update user's Creator Directory visibility preference
 * Privacy-First: Defaults to hidden, requires explicit opt-in
 */
router.post('/creator-directory', async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authMiddleware
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { show_in_directory } = req.body;

    if (typeof show_in_directory !== 'boolean') {
      return res.status(400).json({ error: 'show_in_directory must be a boolean' });
    }

    // If enabling, verify profile is complete
    if (show_in_directory) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('avatar_url, username, bio')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return res.status(500).json({ error: 'Failed to fetch profile' });
      }

      if (!profile.avatar_url || !profile.username || !profile.bio) {
        return res.status(400).json({ 
          error: 'Profile incomplete', 
          message: 'Avatar, username, and bio are required to appear in Creator Directory' 
        });
      }
    }

    // Update the setting
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({ 
        show_in_creator_directory: show_in_directory,
        last_active_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating creator directory setting:', updateError);
      return res.status(500).json({ error: 'Failed to update setting' });
    }

    return res.json({ 
      success: true, 
      show_in_directory,
      message: show_in_directory 
        ? 'You are now visible in the Creator Directory' 
        : 'You have been removed from the Creator Directory'
    });
  } catch (err) {
    console.error('Creator directory update error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
