import { Router, Request, Response } from 'express';
import { adminSupabase } from '../supabase';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, applicant } = req.query;
    
    let query = adminSupabase
      .from('grant_applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (applicant) {
      query = query.eq('applicant_id', applicant);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('[Grants] Failed to fetch grants:', error);
      return res.status(500).json({ error: 'Failed to fetch grants' });
    }
    
    return res.json(data || []);
  } catch (err) {
    console.error('[Grants] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch grants' });
  }
});

router.get('/my-grants', async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { data, error } = await adminSupabase
      .from('grant_applications')
      .select('*')
      .eq('applicant_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[Grants] Failed to fetch user grants:', error);
      return res.status(500).json({ error: 'Failed to fetch your grants' });
    }
    
    return res.json(data || []);
  } catch (err) {
    console.error('[Grants] My grants error:', err);
    return res.status(500).json({ error: 'Failed to fetch your grants' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { projectName, teamDetails, projectDescription, fundingAmount } = req.body;
    
    if (!projectName || !projectDescription || !fundingAmount) {
      return res.status(400).json({ error: 'Project name, description, and funding amount are required' });
    }
    
    const amount = parseFloat(fundingAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid funding amount' });
    }
    
    const { data: profile } = await adminSupabase
      .from('user_profiles')
      .select('username, wallet_address')
      .eq('id', user.id)
      .single();
    
    const { data, error } = await adminSupabase
      .from('grant_applications')
      .insert({
        applicant_id: user.id,
        applicant_name: profile?.username || 'Anonymous',
        applicant_address: profile?.wallet_address || null,
        project_name: projectName,
        team_details: teamDetails || '',
        project_description: projectDescription,
        funding_amount: amount,
        status: 'Pending',
      })
      .select()
      .single();
    
    if (error) {
      console.error('[Grants] Failed to create application:', error);
      return res.status(500).json({ error: 'Failed to submit application' });
    }
    
    return res.json({
      success: true,
      message: 'Grant application submitted successfully',
      grant: data,
    });
  } catch (err) {
    console.error('[Grants] Submit error:', err);
    return res.status(500).json({ error: 'Failed to submit application' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await adminSupabase
      .from('grant_applications')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: 'Grant application not found' });
    }
    
    return res.json(data);
  } catch (err) {
    console.error('[Grants] Get grant error:', err);
    return res.status(500).json({ error: 'Failed to fetch grant' });
  }
});

router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { data: profile } = await adminSupabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (!profile || !['admin', 'owner', 'founder'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { id } = req.params;
    const { status, feedback } = req.body;
    
    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const { data, error } = await adminSupabase
      .from('grant_applications')
      .update({
        status,
        admin_feedback: feedback || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('[Grants] Failed to update status:', error);
      return res.status(500).json({ error: 'Failed to update status' });
    }
    
    return res.json(data);
  } catch (err) {
    console.error('[Grants] Update status error:', err);
    return res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
