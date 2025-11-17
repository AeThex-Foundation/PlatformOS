import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  start_time: string;
  end_time: string;
  capacity: number;
  registered_count: number;
  status: string;
  tags: string[];
  xp_reward: number;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, upcoming = 'false' } = req.query;

    let query = supabaseAdmin
      .from('workshops')
      .select('*')
      .order('start_time', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    } else if (upcoming === 'true') {
      query = query.gte('start_time', new Date().toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Workshops API] Error fetching workshops:', error);
      return res.status(500).json({ error: 'Failed to fetch workshops' });
    }

    res.set('Cache-Control', 'public, max-age=120');
    res.json({ workshops: data || [] });
  } catch (error) {
    console.error('[Workshops API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:workshopId/register', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { workshopId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: workshop, error: workshopError } = await supabaseAdmin
      .from('workshops')
      .select('*')
      .eq('id', workshopId)
      .single();

    if (workshopError || !workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    if (workshop.registered_count >= workshop.capacity) {
      return res.status(409).json({ error: 'Workshop is full' });
    }

    const { data: existingReg } = await supabaseAdmin
      .from('workshop_registrations')
      .select('id')
      .eq('workshop_id', workshopId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingReg) {
      return res.status(409).json({ error: 'Already registered for this workshop' });
    }

    const { data: registration, error: regError } = await supabaseAdmin
      .from('workshop_registrations')
      .insert({
        workshop_id: workshopId,
        user_id: userId,
      })
      .select()
      .single();

    if (regError) {
      console.error('[Workshops API] Error registering user:', regError);
      return res.status(500).json({ error: 'Failed to register for workshop' });
    }

    await supabaseAdmin
      .from('workshops')
      .update({ registered_count: workshop.registered_count + 1 })
      .eq('id', workshopId);

    res.status(201).json({ success: true, registration });
  } catch (error) {
    console.error('[Workshops API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/my-registrations', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data, error } = await supabaseAdmin
      .from('workshop_registrations')
      .select(`
        id,
        registered_at,
        attended,
        workshops (
          id,
          title,
          description,
          instructor_name,
          start_time,
          end_time,
          status,
          tags,
          xp_reward
        )
      `)
      .eq('user_id', userId)
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('[Workshops API] Error fetching user registrations:', error);
      return res.status(500).json({ error: 'Failed to fetch registrations' });
    }

    res.json({ registrations: data || [] });
  } catch (error) {
    console.error('[Workshops API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
