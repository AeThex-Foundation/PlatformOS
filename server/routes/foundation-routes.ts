import express, { Request, Response } from 'express';
import { adminSupabase } from '../supabase';

const router = express.Router();

router.get('/courses', async (req: Request, res: Response) => {
  try {
    if (!adminSupabase) {
      console.warn('[Foundation API] Supabase not configured, returning empty courses');
      res.set('Cache-Control', 'public, max-age=300');
      return res.json([]);
    }

    const { category, difficulty, search } = req.query;

    let query = adminSupabase
      .from('foundation_courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        console.warn('[Foundation API] Courses table not found, returning empty array');
        res.set('Cache-Control', 'public, max-age=300');
        return res.json([]);
      }
      console.error('[Foundation API] Error fetching courses:', error);
      return res.status(500).json({ error: 'Failed to fetch courses' });
    }

    res.set('Cache-Control', 'public, max-age=300');
    res.json(data || []);
  } catch (error) {
    console.error('[Foundation API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats', async (req: Request, res: Response) => {
  try {
    if (!adminSupabase) {
      res.set('Cache-Control', 'public, max-age=600');
      return res.json({ courses: 50, workshops: 25, learners: 15000 });
    }

    const [coursesResult, workshopsResult, usersResult] = await Promise.all([
      adminSupabase.from('foundation_courses').select('id', { count: 'exact', head: true }),
      adminSupabase.from('workshops').select('id', { count: 'exact', head: true }),
      adminSupabase.from('user_profiles').select('id', { count: 'exact', head: true }),
    ]);

    res.set('Cache-Control', 'public, max-age=600');
    res.json({
      courses: coursesResult.count || 0,
      workshops: workshopsResult.count || 0,
      learners: usersResult.count || 0,
    });
  } catch (error) {
    console.error('[Foundation API] Stats error:', error);
    res.json({ courses: 50, workshops: 25, learners: 15000 });
  }
});

export default router;
