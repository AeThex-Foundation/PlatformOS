import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('id, last_sign_in_at')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('[Sessions API] Error fetching user:', error);
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }

    const mockSession = {
      id: 'current-session',
      created_at: data.last_sign_in_at || new Date().toISOString(),
      user_agent: req.headers['user-agent'] || 'Unknown',
      ip: req.ip || 'Unknown',
      is_current: true,
      device: 'Web Browser',
      location: 'Unknown',
    };

    res.json({ sessions: [mockSession] });
  } catch (error) {
    console.error('[Sessions API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:sessionId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { sessionId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (sessionId === 'current-session') {
      const { error } = await supabaseAdmin.auth.admin.signOut(userId);
      
      if (error) {
        console.error('[Sessions API] Error revoking session:', error);
        return res.status(500).json({ error: 'Failed to revoke session' });
      }

      res.json({
        success: true,
        message: 'Session revoked successfully. Please log in again.',
        requiresRelogin: true,
      });
    } else {
      return res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    console.error('[Sessions API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
