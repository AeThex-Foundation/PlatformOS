import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

interface LeaderboardEntry {
  rank: number;
  username: string;
  full_name: string;
  avatar_url: string | null;
  total_xp: number;
  level: number;
  badge_count: number;
  streak_days?: number;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const { type = 'xp', limit = '50' } = req.query;
    const maxLimit = Math.min(parseInt(limit as string, 10) || 50, 100);

    if (type === 'badges') {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('id, username, full_name, avatar_url, total_xp, level, streak_days')
        .not('username', 'is', null);

      if (error) {
        console.error('[Leaderboard API] Error fetching profiles:', error);
        return res.status(500).json({ error: 'Failed to fetch leaderboard' });
      }

      const profilesWithBadges = await Promise.all(
        (data || []).map(async (profile) => {
          const { count } = await supabaseAdmin
            .from('user_achievements')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', profile.id);

          return {
            username: profile.username,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            total_xp: profile.total_xp || 0,
            level: profile.level || 1,
            badge_count: count || 0,
            streak_days: profile.streak_days || 0,
          };
        })
      );

      const sorted = profilesWithBadges
        .sort((a, b) => b.badge_count - a.badge_count)
        .slice(0, maxLimit);

      const leaderboard: LeaderboardEntry[] = sorted.map((profile, index) => ({
        rank: index + 1,
        ...profile,
      }));

      res.set('Cache-Control', 'public, max-age=60');
      return res.json({ leaderboard, type });
    }

    let orderBy: { column: string; ascending: boolean };
    
    switch (type) {
      case 'streaks':
        orderBy = { column: 'streak_days', ascending: false };
        break;
      case 'xp':
      default:
        orderBy = { column: 'total_xp', ascending: false };
    }

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('id, username, full_name, avatar_url, total_xp, level, streak_days')
      .not('username', 'is', null)
      .order(orderBy.column, { ascending: orderBy.ascending })
      .limit(maxLimit);

    if (error) {
      console.error('[Leaderboard API] Error fetching leaderboard:', error);
      return res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }

    const profilesWithBadges = await Promise.all(
      (data || []).map(async (profile) => {
        const { count } = await supabaseAdmin
          .from('user_achievements')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        return {
          username: profile.username,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          total_xp: profile.total_xp || 0,
          level: profile.level || 1,
          badge_count: count || 0,
          streak_days: profile.streak_days || 0,
        };
      })
    );

    const leaderboard: LeaderboardEntry[] = profilesWithBadges.map((profile, index) => ({
      rank: index + 1,
      ...profile,
    }));

    res.set('Cache-Control', 'public, max-age=60');
    res.json({ leaderboard, type });
  } catch (error) {
    console.error('[Leaderboard API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
