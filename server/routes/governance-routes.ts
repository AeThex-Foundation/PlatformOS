import { Router, Request, Response } from 'express';
import { adminSupabase } from '../supabase';

const router = Router();

router.get('/proposals', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    let query = adminSupabase
      .from('governance_proposals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('[Governance] Failed to fetch proposals:', error);
      return res.status(500).json({ error: 'Failed to fetch proposals' });
    }
    
    return res.json(data || []);
  } catch (err) {
    console.error('[Governance] Proposals error:', err);
    return res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

router.get('/proposals/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await adminSupabase
      .from('governance_proposals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    return res.json(data);
  } catch (err) {
    console.error('[Governance] Get proposal error:', err);
    return res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

router.post('/proposals', async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { title, description, category } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const { data: profile } = await adminSupabase
      .from('user_profiles')
      .select('username, aethex_domain')
      .eq('id', user.id)
      .single();
    
    const proposerName = profile?.username || profile?.aethex_domain || 'Anonymous';
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    const { data, error } = await adminSupabase
      .from('governance_proposals')
      .insert({
        title,
        description,
        category: category || 'General',
        proposer_id: user.id,
        proposer_name: proposerName,
        status: 'Active',
        votes_for: 0,
        votes_against: 0,
        end_date: endDate.toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('[Governance] Failed to create proposal:', error);
      return res.status(500).json({ error: 'Failed to create proposal' });
    }
    
    return res.json(data);
  } catch (err) {
    console.error('[Governance] Create proposal error:', err);
    return res.status(500).json({ error: 'Failed to create proposal' });
  }
});

router.post('/proposals/:id/vote', async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { id } = req.params;
    const { vote, votingPower } = req.body;
    
    if (!vote || !['for', 'against'].includes(vote)) {
      return res.status(400).json({ error: 'Invalid vote. Must be "for" or "against"' });
    }
    
    const power = parseInt(votingPower) || 1;
    
    const { data: existingVote } = await adminSupabase
      .from('governance_votes')
      .select('id')
      .eq('proposal_id', id)
      .eq('voter_id', user.id)
      .single();
    
    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted on this proposal' });
    }
    
    const { data: proposal } = await adminSupabase
      .from('governance_proposals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    if (proposal.status !== 'Active') {
      return res.status(400).json({ error: 'Voting is closed for this proposal' });
    }
    
    await adminSupabase
      .from('governance_votes')
      .insert({
        proposal_id: id,
        voter_id: user.id,
        vote,
        voting_power: power,
      });
    
    const updateField = vote === 'for' ? 'votes_for' : 'votes_against';
    const currentVotes = proposal[updateField] || 0;
    
    await adminSupabase
      .from('governance_proposals')
      .update({ [updateField]: currentVotes + power })
      .eq('id', id);
    
    return res.json({ success: true, message: 'Vote recorded successfully' });
  } catch (err) {
    console.error('[Governance] Vote error:', err);
    return res.status(500).json({ error: 'Failed to record vote' });
  }
});

router.get('/treasury', async (_req: Request, res: Response) => {
  try {
    return res.json({
      balance: 1250450,
      currency: 'USDC',
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Governance] Treasury error:', err);
    return res.status(500).json({ error: 'Failed to fetch treasury balance' });
  }
});

export default router;
