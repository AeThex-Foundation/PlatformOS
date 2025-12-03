import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCreatorPassport } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;
  
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Slug is required' });
  }

  try {
    const passport = await getCreatorPassport(slug);
    
    if (!passport) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(passport);
  } catch (error) {
    console.error('Error fetching passport:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
