import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

interface AdminUser {
  id: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  roles: string[];
  arms: string[];
  total_xp: number;
  level: number;
  created_at: string;
  last_active_at: string;
}

const isAdmin = async (userId: string): Promise<boolean> => {
  const { data } = await supabaseAdmin
    .from('user_profiles')
    .select('roles')
    .eq('id', userId)
    .single();

  if (!data || !data.roles) return false;

  const adminRoles = ['owner', 'admin', 'founder'];
  return data.roles.some((role: string) => adminRoles.includes(role));
};

router.get('/users', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { search, role, arm, limit = '100' } = req.query;
    const maxLimit = Math.min(parseInt(limit as string, 10) || 100, 500);

    let query = supabaseAdmin
      .from('user_profiles')
      .select('id, username, full_name, email, avatar_url, roles, arms, total_xp, level, created_at, last_active_at')
      .order('created_at', { ascending: false })
      .limit(maxLimit);

    if (search) {
      query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (role) {
      query = query.contains('roles', [role]);
    }

    if (arm) {
      query = query.contains('arms', [arm]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Admin API] Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    res.json({ users: data || [] });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/users/:targetUserId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { targetUserId } = req.params;
    const { roles, arms, total_xp, level } = req.body;

    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    if (!targetUserId) {
      return res.status(400).json({ error: 'Target user ID is required' });
    }

    const updateData: any = {};
    if (roles !== undefined) updateData.roles = roles;
    if (arms !== undefined) updateData.arms = arms;
    if (total_xp !== undefined) updateData.total_xp = total_xp;
    if (level !== undefined) updateData.level = level;

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update(updateData)
      .eq('id', targetUserId)
      .select()
      .single();

    if (error) {
      console.error('[Admin API] Error updating user:', error);
      return res.status(500).json({ error: 'Failed to update user' });
    }

    res.json({ success: true, user: data });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
