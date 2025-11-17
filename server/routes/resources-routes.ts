import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, featured = 'false' } = req.query;

    let query = supabaseAdmin
      .from('resources')
      .select('*')
      .order('published_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Resources API] Error fetching resources:', error);
      return res.status(500).json({ error: 'Failed to fetch resources' });
    }

    res.set('Cache-Control', 'public, max-age=300');
    res.json({ resources: data || [] });
  } catch (error) {
    console.error('[Resources API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:resourceId/download', async (req: Request, res: Response) => {
  try {
    const { resourceId } = req.params;
    const userId = (req as any).user?.id || null;

    const { data: resource, error: resourceError } = await supabaseAdmin
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .single();

    if (resourceError || !resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const { error: downloadError } = await supabaseAdmin
      .from('resource_downloads')
      .insert({
        resource_id: resourceId,
        user_id: userId,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      });

    if (downloadError) {
      console.error('[Resources API] Error recording download:', downloadError);
    }

    await supabaseAdmin
      .from('resources')
      .update({ download_count: resource.download_count + 1 })
      .eq('id', resourceId);

    res.json({
      success: true,
      download_url: resource.file_url,
      title: resource.title,
      file_type: resource.file_type,
    });
  } catch (error) {
    console.error('[Resources API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
