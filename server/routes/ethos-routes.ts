/**
 * Ethos Guild API Routes
 * Audio portfolio management for the AeThex ecosystem
 */

import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../oauth/oauth-service';

const router = Router();

/**
 * GET /api/ethos/artists
 * Get artist profile(s) - either by ID or list all
 */
router.get('/artists', async (req: Request, res: Response) => {
  try {
    const artistId = req.query.id as string;

    if (artistId) {
      const { data: artist, error: artistError } = await supabaseAdmin
        .from('ethos_artist_profiles')
        .select(`
          user_id,
          skills,
          for_hire,
          bio,
          portfolio_url,
          sample_price_track,
          sample_price_sfx,
          sample_price_score,
          turnaround_days,
          verified,
          total_downloads,
          created_at,
          user_profiles(id, full_name, avatar_url, username)
        `)
        .eq('user_id', artistId)
        .single();

      if (artistError && artistError.code !== 'PGRST116') {
        console.error('[Ethos] Artist fetch error:', artistError);
        throw artistError;
      }

      if (!artist) {
        return res.json({ tracks: [], verified: false, skills: [] });
      }

      const { data: tracks } = await supabaseAdmin
        .from('ethos_tracks')
        .select('*')
        .eq('user_id', artistId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      res.json({
        ...artist,
        tracks: tracks || [],
      });
    } else {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const verified = req.query.verified === 'true';
      const forHire = req.query.forHire === 'true';

      let dbQuery = supabaseAdmin
        .from('ethos_artist_profiles')
        .select(`
          user_id,
          skills,
          for_hire,
          bio,
          portfolio_url,
          verified,
          total_downloads,
          created_at,
          user_profiles(id, full_name, avatar_url, username)
        `, { count: 'exact' });

      if (verified) dbQuery = dbQuery.eq('verified', true);
      if (forHire) dbQuery = dbQuery.eq('for_hire', true);

      const { data, error, count } = await dbQuery
        .order('verified', { ascending: false })
        .order('total_downloads', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      res.json({
        data: data || [],
        total: count || 0,
        limit,
        offset,
      });
    }
  } catch (err: any) {
    console.error('[Ethos Artists]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/ethos/artists
 * Update or create artist profile
 */
router.put('/artists', async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authMiddleware
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const {
      skills,
      for_hire,
      bio,
      portfolio_url,
      sample_price_track,
      sample_price_sfx,
      sample_price_score,
      turnaround_days,
    } = req.body;

    const { data, error } = await supabaseAdmin
      .from('ethos_artist_profiles')
      .upsert({
        user_id: user.id,
        skills: skills || [],
        for_hire: for_hire !== false,
        bio,
        portfolio_url,
        sample_price_track,
        sample_price_sfx,
        sample_price_score,
        turnaround_days,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select();

    if (error) throw error;
    res.json(data?.[0] || { success: true });
  } catch (err: any) {
    console.error('[Ethos Artists Update]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/ethos/tracks
 * Get published tracks with optional filters
 * NOTE: Only returns published tracks for public access
 * Use /api/ethos/my-profile for authenticated access to own unpublished tracks
 */
router.get('/tracks', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const genre = req.query.genre as string;
    const licenseType = req.query.licenseType as string;
    const search = req.query.search as string;
    const artistId = req.query.artistId as string;

    let dbQuery = supabaseAdmin
      .from('ethos_tracks')
      .select(`
        id,
        user_id,
        title,
        description,
        file_url,
        duration_seconds,
        genre,
        license_type,
        bpm,
        is_published,
        download_count,
        created_at,
        updated_at,
        user_profiles(id, full_name, avatar_url, username)
      `, { count: 'exact' })
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (artistId) {
      dbQuery = dbQuery.eq('user_id', artistId);
    }

    if (genre) dbQuery = dbQuery.contains('genre', [genre]);
    if (licenseType) dbQuery = dbQuery.eq('license_type', licenseType);
    if (search) dbQuery = dbQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    const { data, error, count } = await dbQuery.range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      data: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (err: any) {
    console.error('[Ethos Tracks]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/ethos/tracks
 * Upload a new track
 */
router.post('/tracks', async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authMiddleware
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const {
      title,
      description,
      file_url,
      duration_seconds,
      genre,
      license_type,
      bpm,
      is_published,
    } = req.body;

    if (!title || !file_url || !license_type) {
      return res.status(400).json({
        error: 'Missing required fields: title, file_url, license_type',
      });
    }

    const { data, error } = await supabaseAdmin
      .from('ethos_tracks')
      .insert([{
        user_id: user.id,
        title,
        description,
        file_url,
        duration_seconds,
        genre: genre || [],
        license_type,
        bpm,
        is_published: is_published !== false,
      }])
      .select();

    if (error) throw error;

    res.status(201).json(data?.[0]);
  } catch (err: any) {
    console.error('[Ethos Tracks Create]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/ethos/tracks/:id
 * Update a track
 */
router.put('/tracks/:id', async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authMiddleware
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const trackId = req.params.id;
    const {
      title,
      description,
      genre,
      license_type,
      bpm,
      is_published,
    } = req.body;

    const { data: existing } = await supabaseAdmin
      .from('ethos_tracks')
      .select('user_id')
      .eq('id', trackId)
      .single();

    if (!existing || existing.user_id !== user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this track' });
    }

    const { data, error } = await supabaseAdmin
      .from('ethos_tracks')
      .update({
        title,
        description,
        genre,
        license_type,
        bpm,
        is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', trackId)
      .select();

    if (error) throw error;

    res.json(data?.[0]);
  } catch (err: any) {
    console.error('[Ethos Tracks Update]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/ethos/tracks/:id
 * Delete a track
 */
router.delete('/tracks/:id', async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authMiddleware
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const trackId = req.params.id;

    const { data: existing } = await supabaseAdmin
      .from('ethos_tracks')
      .select('user_id, file_url')
      .eq('id', trackId)
      .single();

    if (!existing || existing.user_id !== user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this track' });
    }

    const { error } = await supabaseAdmin
      .from('ethos_tracks')
      .delete()
      .eq('id', trackId);

    if (error) throw error;

    res.json({ success: true });
  } catch (err: any) {
    console.error('[Ethos Tracks Delete]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/ethos/my-profile
 * Get the current user's artist profile
 */
router.get('/my-profile', async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authMiddleware
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { data: artist, error } = await supabaseAdmin
      .from('ethos_artist_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const { data: tracks } = await supabaseAdmin
      .from('ethos_tracks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    res.json({
      profile: artist || null,
      tracks: tracks || [],
    });
  } catch (err: any) {
    console.error('[Ethos My Profile]', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
