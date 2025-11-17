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
