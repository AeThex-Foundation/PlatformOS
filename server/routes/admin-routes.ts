import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.use(requireAuth);

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

router.get('/passport/members', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { data: profiles, error } = await supabaseAdmin
      .from('user_profiles')
      .select('id, username, email, full_name, avatar_url, is_verified, is_admin, level, total_xp, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('[Admin API] Error fetching passport members:', error);
      return res.status(500).json({ error: 'Failed to fetch members' });
    }

    res.json({ members: profiles || [] });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/passport/stats', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { count: totalUsers } = await supabaseAdmin
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    const { count: verifiedUsers } = await supabaseAdmin
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', true);

    const { data: xpData } = await supabaseAdmin
      .from('user_profiles')
      .select('total_xp, level');

    const totalXp = (xpData || []).reduce((sum: number, u: any) => sum + (u.total_xp || 0), 0);
    const avgLevel = xpData && xpData.length > 0
      ? (xpData || []).reduce((sum: number, u: any) => sum + (u.level || 1), 0) / xpData.length
      : 1;

    res.json({
      total_users: totalUsers || 0,
      verified_users: verifiedUsers || 0,
      total_xp: totalXp,
      avg_level: avgLevel,
    });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/passport/verify', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { userId: targetUserId, verified } = req.body;

    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    if (!targetUserId) {
      return res.status(400).json({ error: 'Target user ID is required' });
    }

    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({ is_verified: verified })
      .eq('id', targetUserId);

    if (error) {
      console.error('[Admin API] Error updating verification:', error);
      return res.status(500).json({ error: 'Failed to update verification' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/mentors', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { data, error } = await supabaseAdmin
      .from('mentors')
      .select(`
        id, user_id, bio, expertise, hourly_rate, available, created_at, updated_at,
        user_profiles:user_id(id, username, full_name, email, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin API] Error fetching mentors:', error);
      return res.status(500).json({ error: 'Failed to fetch mentors' });
    }

    res.json({ mentors: data || [] });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/mentors/:mentorId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { mentorId } = req.params;
    const { available, expertise, hourly_rate, bio } = req.body;

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (available !== undefined) {
      if (typeof available !== 'boolean') {
        return res.status(400).json({ error: 'available must be a boolean' });
      }
      updates.available = available;
    }
    if (expertise !== undefined) {
      if (!Array.isArray(expertise) || !expertise.every(e => typeof e === 'string')) {
        return res.status(400).json({ error: 'expertise must be an array of strings' });
      }
      updates.expertise = expertise;
    }
    if (hourly_rate !== undefined) {
      if (typeof hourly_rate !== 'number' || hourly_rate < 0) {
        return res.status(400).json({ error: 'hourly_rate must be a positive number' });
      }
      updates.hourly_rate = hourly_rate;
    }
    if (bio !== undefined) {
      if (typeof bio !== 'string' || bio.length > 2000) {
        return res.status(400).json({ error: 'bio must be a string under 2000 characters' });
      }
      updates.bio = bio;
    }

    const { data, error } = await supabaseAdmin
      .from('mentors')
      .update(updates)
      .eq('id', mentorId)
      .select()
      .single();

    if (error) {
      console.error('[Admin API] Error updating mentor:', error);
      return res.status(500).json({ error: 'Failed to update mentor' });
    }

    res.json({ success: true, mentor: data });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/mentors/:mentorId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { mentorId } = req.params;

    const { error } = await supabaseAdmin
      .from('mentors')
      .delete()
      .eq('id', mentorId);

    if (error) {
      console.error('[Admin API] Error deleting mentor:', error);
      return res.status(500).json({ error: 'Failed to delete mentor' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/opportunities', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { data, error } = await supabaseAdmin
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin API] Error fetching opportunities:', error);
      return res.status(500).json({ error: 'Failed to fetch opportunities' });
    }

    res.json({ opportunities: data || [] });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/opportunities/:opportunityId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { opportunityId } = req.params;
    const { title, description, company, location, type, arm, salary_range, requirements, deadline } = req.body;

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    
    if (title !== undefined) {
      if (typeof title !== 'string' || title.length > 200) {
        return res.status(400).json({ error: 'title must be a string under 200 characters' });
      }
      updates.title = title;
    }
    if (description !== undefined) {
      if (typeof description !== 'string' || description.length > 5000) {
        return res.status(400).json({ error: 'description must be a string under 5000 characters' });
      }
      updates.description = description;
    }
    if (company !== undefined) {
      if (typeof company !== 'string' || company.length > 200) {
        return res.status(400).json({ error: 'company must be a string under 200 characters' });
      }
      updates.company = company;
    }
    if (location !== undefined) {
      if (typeof location !== 'string' || location.length > 200) {
        return res.status(400).json({ error: 'location must be a string under 200 characters' });
      }
      updates.location = location;
    }
    if (type !== undefined) {
      const validTypes = ['full-time', 'part-time', 'contract', 'freelance', 'internship', 'collaboration'];
      if (typeof type !== 'string' || !validTypes.includes(type)) {
        return res.status(400).json({ error: `type must be one of: ${validTypes.join(', ')}` });
      }
      updates.type = type;
    }
    if (arm !== undefined) {
      const validArms = ['GameForge', 'Ethos', 'Labs', 'Foundation', 'Visuals', 'General'];
      if (typeof arm !== 'string' || !validArms.includes(arm)) {
        return res.status(400).json({ error: `arm must be one of: ${validArms.join(', ')}` });
      }
      updates.arm = arm;
    }
    if (salary_range !== undefined) {
      if (typeof salary_range !== 'string' || salary_range.length > 100) {
        return res.status(400).json({ error: 'salary_range must be a string under 100 characters' });
      }
      updates.salary_range = salary_range;
    }
    if (requirements !== undefined) {
      if (!Array.isArray(requirements) || !requirements.every(r => typeof r === 'string')) {
        return res.status(400).json({ error: 'requirements must be an array of strings' });
      }
      updates.requirements = requirements;
    }
    if (deadline !== undefined) {
      if (deadline !== null && isNaN(Date.parse(deadline))) {
        return res.status(400).json({ error: 'deadline must be a valid date string or null' });
      }
      updates.deadline = deadline;
    }

    const { data, error } = await supabaseAdmin
      .from('opportunities')
      .update(updates)
      .eq('id', opportunityId)
      .select()
      .single();

    if (error) {
      console.error('[Admin API] Error updating opportunity:', error);
      return res.status(500).json({ error: 'Failed to update opportunity' });
    }

    res.json({ success: true, opportunity: data });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/opportunities/:opportunityId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { opportunityId } = req.params;

    const { error } = await supabaseAdmin
      .from('opportunities')
      .delete()
      .eq('id', opportunityId);

    if (error) {
      console.error('[Admin API] Error deleting opportunity:', error);
      return res.status(500).json({ error: 'Failed to delete opportunity' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/mentorship-requests', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { data, error } = await supabaseAdmin
      .from('mentorship_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin API] Error fetching mentorship requests:', error);
      return res.status(500).json({ error: 'Failed to fetch mentorship requests' });
    }

    res.json({ requests: data || [] });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/mentorship-requests/:requestId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { requestId } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'accepted', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabaseAdmin
      .from('mentorship_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('[Admin API] Error updating mentorship request:', error);
      return res.status(500).json({ error: 'Failed to update mentorship request' });
    }

    res.json({ success: true, request: data });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/mentorship-requests/:requestId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { requestId } = req.params;

    const { error } = await supabaseAdmin
      .from('mentorship_requests')
      .delete()
      .eq('id', requestId);

    if (error) {
      console.error('[Admin API] Error deleting mentorship request:', error);
      return res.status(500).json({ error: 'Failed to delete mentorship request' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/endorsements', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { data, error } = await supabaseAdmin
      .from('endorsements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin API] Error fetching endorsements:', error);
      return res.status(500).json({ error: 'Failed to fetch endorsements' });
    }

    res.json({ endorsements: data || [] });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/endorsements/:endorsementId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { endorsementId } = req.params;

    const { error } = await supabaseAdmin
      .from('endorsements')
      .delete()
      .eq('id', endorsementId);

    if (error) {
      console.error('[Admin API] Error deleting endorsement:', error);
      return res.status(500).json({ error: 'Failed to delete endorsement' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(await isAdmin(userId))) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const [
      { count: mentorCount },
      { count: opportunityCount },
      { count: requestCount },
      { count: endorsementCount }
    ] = await Promise.all([
      supabaseAdmin.from('mentors').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('opportunities').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('mentorship_requests').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('endorsements').select('*', { count: 'exact', head: true })
    ]);

    res.json({
      mentors: mentorCount || 0,
      opportunities: opportunityCount || 0,
      mentorship_requests: requestCount || 0,
      endorsements: endorsementCount || 0
    });
  } catch (error) {
    console.error('[Admin API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
