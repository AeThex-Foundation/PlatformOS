/**
 * GameForge API Routes - READ-ONLY SHOWCASE MODE
 * 
 * LEGAL COMPLIANCE: Foundation is a Non-Profit entity.
 * All write operations (POST/PUT/DELETE) belong on aethex.dev (Corp).
 * 
 * This API provides public read-only access to showcase:
 * - Released games (mission proof for grants)
 * - Team credits (talent portfolio for graduates)
 */

import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../oauth/oauth-service';

const router = Router();

/**
 * GET /api/gameforge/releases
 * Public showcase of released/completed games
 * No auth required - this is public mission proof
 */
router.get('/releases', async (req: Request, res: Response) => {
  try {
    const platform = req.query.platform as string;
    const genre = req.query.genre as string;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    let dbQuery = supabaseAdmin
      .from('gameforge_projects')
      .select(`
        id,
        name,
        description,
        platform,
        genre,
        actual_release_date,
        team_size,
        created_at,
        lead_id,
        user_profiles!lead_id(id, full_name, avatar_url, username)
      `, { count: 'exact' })
      .in('status', ['released', 'completed']);

    if (platform) dbQuery = dbQuery.eq('platform', platform);
    if (genre) dbQuery = dbQuery.contains('genre', [genre]);

    const { data, error, count } = await dbQuery
      .order('actual_release_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      releases: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (err: any) {
    console.error('[GameForge Releases]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/gameforge/releases/:slug
 * Individual game showcase page
 * Used by graduates as verified portfolio link
 */
router.get('/releases/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabaseAdmin
      .from('gameforge_projects')
      .select(`
        id,
        name,
        description,
        platform,
        genre,
        actual_release_date,
        team_size,
        repository_url,
        documentation_url,
        created_at,
        lead_id,
        user_profiles!lead_id(id, full_name, avatar_url, username),
        gameforge_team_members(
          id, role, role_title,
          user_profiles(id, full_name, avatar_url, username)
        )
      `)
      .or(`id.eq.${slug},name.ilike.${slug.replace(/-/g, ' ')}`)
      .in('status', ['released', 'completed'])
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Release not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (err: any) {
    console.error('[GameForge Release Detail]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/gameforge/stats
 * Public statistics for showcase (grant applications, trust building)
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { count: releasedCount } = await supabaseAdmin
      .from('gameforge_projects')
      .select('id', { count: 'exact', head: true })
      .in('status', ['released', 'completed']);

    const { count: graduateCount } = await supabaseAdmin
      .from('gameforge_team_members')
      .select('user_id', { count: 'exact', head: true });

    const { data: platforms } = await supabaseAdmin
      .from('gameforge_projects')
      .select('platform')
      .in('status', ['released', 'completed']);

    const uniquePlatforms = [...new Set((platforms || []).map(p => p.platform))];

    res.json({
      total_releases: releasedCount || 0,
      total_graduates: graduateCount || 0,
      platforms: uniquePlatforms,
    });
  } catch (err: any) {
    console.error('[GameForge Stats]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/gameforge/team/:projectId
 * Public team credits for a released project
 * Allows graduates to prove their contributions
 */
router.get('/team/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const { data: project } = await supabaseAdmin
      .from('gameforge_projects')
      .select('id, status')
      .eq('id', projectId)
      .in('status', ['released', 'completed'])
      .single();

    if (!project) {
      return res.status(404).json({ error: 'Project not found or not released' });
    }

    const { data: members, error } = await supabaseAdmin
      .from('gameforge_team_members')
      .select(`
        id,
        role,
        role_title,
        joined_at,
        user_profiles(id, full_name, avatar_url, username)
      `)
      .eq('project_id', projectId);

    if (error) throw error;

    const formattedMembers = (members || []).map((m: any) => ({
      id: m.user_profiles?.id,
      name: m.user_profiles?.full_name || 'Unknown',
      avatar_url: m.user_profiles?.avatar_url,
      username: m.user_profiles?.username,
      role: m.role,
      role_title: m.role_title,
      joined_at: m.joined_at,
    }));

    res.json(formattedMembers);
  } catch (err: any) {
    console.error('[GameForge Team Credits]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/gameforge/publish
 * Receive project submissions from AeThex Studio
 * Requires authentication via Passport OAuth
 * 
 * This creates a "submission" that goes into moderation queue
 * before appearing on the public showcase.
 */
router.post('/publish', async (req: Request, res: Response) => {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    
    // Verify the token with Supabase
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { title, description, genre, platform, tags } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    // Create submission as pending review
    const { data: project, error } = await supabaseAdmin
      .from('gameforge_projects')
      .insert({
        name: title.trim(),
        description: description?.trim() || '',
        genre: Array.isArray(tags) ? [genre, ...tags] : [genre],
        platform: platform || 'roblox',
        status: 'submitted', // Goes to moderation queue
        lead_id: user.id,
        source: 'aethex_studio', // Track submissions from Studio
      })
      .select()
      .single();

    if (error) {
      console.error('[GameForge Publish] DB Error:', error);
      throw error;
    }

    res.json({
      success: true,
      message: 'Project submitted for review',
      url: `${process.env.VITE_APP_URL || 'https://aethex.foundation'}/gameforge/showcase`,
      projectId: project.id,
    });
  } catch (err: any) {
    console.error('[GameForge Publish]', err);
    res.status(500).json({ error: err.message || 'Failed to publish project' });
  }
});

export default router;
