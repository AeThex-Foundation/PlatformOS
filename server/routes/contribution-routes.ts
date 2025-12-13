import { Router, Request, Response } from 'express';
import { adminSupabase } from '../supabase';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { user_id, contribution_type, description, hours_logged } = req.body;
  
  if (!user_id || !contribution_type) {
    return res.status(400).json({ error: 'user_id and contribution_type required' });
  }

  try {
    const { data, error } = await adminSupabase
      .from('foundation_contributions')
      .insert({ 
        user_id, 
        contribution_type, 
        description, 
        hours_logged: hours_logged || null,
        verified: false
      })
      .select()
      .single();

    if (error) {
      console.error('[Contributions] Insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err: any) {
    console.error('[Contributions] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const { data, error } = await adminSupabase
      .from('foundation_contributions')
      .select('contribution_type, hours_logged, verified');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const byType: Record<string, number> = {};
    let totalHours = 0;
    let verifiedCount = 0;

    (data || []).forEach((c: any) => {
      byType[c.contribution_type] = (byType[c.contribution_type] || 0) + 1;
      totalHours += c.hours_logged || 0;
      if (c.verified) verifiedCount++;
    });

    res.json({
      total_contributions: data?.length || 0,
      total_hours: totalHours,
      verified_count: verifiedCount,
      by_type: byType
    });
  } catch (err: any) {
    console.error('[Contributions] Stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { data, error } = await adminSupabase
      .from('foundation_contributions')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (err: any) {
    console.error('[Contributions] Fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
