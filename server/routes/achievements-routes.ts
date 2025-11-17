import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

interface Achievement {
  id: string;
  achievement_id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xp_reward: number;
  rarity: string;
  created_at: string;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, rarity } = req.query;

    let query = supabaseAdmin
      .from('achievements')
      .select('*')
      .order('xp_reward', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (rarity) {
      query = query.eq('rarity', rarity);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Achievements API] Error fetching achievements:', error);
      return res.status(500).json({ error: 'Failed to fetch achievements' });
    }

    res.set('Cache-Control', 'public, max-age=300');
    res.json({ achievements: data || [] });
  } catch (error) {
    console.error('[Achievements API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const { data, error } = await supabaseAdmin
      .from('user_achievements')
      .select(`
        id,
        user_id,
        achievement_id,
        earned_at,
        achievements (
          id,
          achievement_id,
          title,
          description,
          icon,
          category,
          xp_reward,
          rarity
        )
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('[Achievements API] Error fetching user achievements:', error);
      return res.status(500).json({ error: 'Failed to fetch user achievements' });
    }

    res.set('Cache-Control', 'public, max-age=60');
    res.json({ achievements: data || [] });
  } catch (error) {
    console.error('[Achievements API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/grant', async (req: Request, res: Response) => {
  try {
    const adminUserId = (req as any).user?.id;
    const { user_id, achievement_id } = req.body;

    if (!adminUserId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: adminProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('roles')
      .eq('id', adminUserId)
      .single();

    const adminRoles = ['owner', 'admin', 'founder'];
    const isAdmin = adminProfile?.roles?.some((role: string) => adminRoles.includes(role));

    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (!user_id || !achievement_id) {
      return res.status(400).json({ error: 'user_id and achievement_id are required' });
    }

    const achievement = await supabaseAdmin
      .from('achievements')
      .select('*')
      .eq('achievement_id', achievement_id)
      .single();

    if (!achievement.data) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    const { data: existingAchievement } = await supabaseAdmin
      .from('user_achievements')
      .select('id')
      .eq('user_id', user_id)
      .eq('achievement_id', achievement.data.id)
      .maybeSingle();

    if (existingAchievement) {
      return res.status(409).json({ error: 'Achievement already granted' });
    }

    const { data, error } = await supabaseAdmin
      .from('user_achievements')
      .insert({
        user_id,
        achievement_id: achievement.data.id,
        earned_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[Achievements API] Error granting achievement:', error);
      return res.status(500).json({ error: 'Failed to grant achievement' });
    }

    const { error: xpError } = await supabaseAdmin.rpc('increment_user_xp', {
      p_user_id: user_id,
      p_xp_amount: achievement.data.xp_reward,
    });

    if (xpError) {
      console.error('[Achievements API] Error updating XP:', xpError);
    }

    res.status(201).json({
      success: true,
      achievement: data,
      xp_earned: achievement.data.xp_reward,
    });
  } catch (error) {
    console.error('[Achievements API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
