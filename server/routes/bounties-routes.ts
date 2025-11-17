import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, difficulty, project } = req.query;

    let query = supabaseAdmin
      .from('bounties')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    } else {
      query = query.in('status', ['open', 'in_progress']);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    if (project) {
      query = query.eq('project', project);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Bounties API] Error fetching bounties:', error);
      return res.status(500).json({ error: 'Failed to fetch bounties' });
    }

    const bountiesWithPosters = await Promise.all(
      (data || []).map(async (bounty) => {
        const { data: poster } = await supabaseAdmin
          .from('user_profiles')
          .select('username, full_name, avatar_url')
          .eq('id', bounty.posted_by)
          .single();

        return {
          ...bounty,
          posted_by_username: poster?.username || 'unknown',
          posted_by_name: poster?.full_name || 'Unknown',
        };
      })
    );

    res.set('Cache-Control', 'public, max-age=120');
    res.json({ bounties: bountiesWithPosters });
  } catch (error) {
    console.error('[Bounties API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:bountyId/apply', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { bountyId } = req.params;
    const { message } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!message || message.trim().length < 20) {
      return res.status(400).json({ error: 'Application message must be at least 20 characters' });
    }

    const { data: existingApp } = await supabaseAdmin
      .from('bounty_applications')
      .select('id')
      .eq('bounty_id', bountyId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingApp) {
      return res.status(409).json({ error: 'You have already applied to this bounty' });
    }

    const { data: application, error: appError } = await supabaseAdmin
      .from('bounty_applications')
      .insert({
        bounty_id: bountyId,
        user_id: userId,
        message,
      })
      .select()
      .single();

    if (appError) {
      console.error('[Bounties API] Error creating application:', appError);
      return res.status(500).json({ error: 'Failed to submit application' });
    }

    const { data: bounty } = await supabaseAdmin
      .from('bounties')
      .select('applicant_count')
      .eq('id', bountyId)
      .single();

    if (bounty) {
      await supabaseAdmin
        .from('bounties')
        .update({ applicant_count: bounty.applicant_count + 1 })
        .eq('id', bountyId);
    }

    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error('[Bounties API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/my-applications', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data, error } = await supabaseAdmin
      .from('bounty_applications')
      .select(`
        id,
        status,
        message,
        applied_at,
        bounties (
          id,
          bounty_id,
          title,
          description,
          difficulty,
          reward_usd,
          xp_reward,
          project,
          status
        )
      `)
      .eq('user_id', userId)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('[Bounties API] Error fetching applications:', error);
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }

    res.json({ applications: data || [] });
  } catch (error) {
    console.error('[Bounties API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
