import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: tokens, error } = await supabaseAdmin
      .from('oauth_refresh_tokens')
      .select(`
        id,
        created_at,
        last_used_at,
        oauth_clients (
          client_id,
          client_name,
          client_uri,
          logo_uri
        )
      `)
      .eq('user_id', userId)
      .eq('revoked', false);

    if (error) {
      console.error('[OAuth Clients API] Error fetching authorized clients:', error);
      return res.status(500).json({ error: 'Failed to fetch authorized clients' });
    }

    const uniqueClients = new Map();
    
    (tokens || []).forEach((token: any) => {
      const client = token.oauth_clients;
      if (client && !uniqueClients.has(client.client_id)) {
        uniqueClients.set(client.client_id, {
          client_id: client.client_id,
          client_name: client.client_name,
          client_uri: client.client_uri,
          logo_uri: client.logo_uri,
          authorized_at: token.created_at,
          last_used_at: token.last_used_at,
        });
      }
    });

    const clients = Array.from(uniqueClients.values());

    res.json({ clients });
  } catch (error) {
    console.error('[OAuth Clients API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:clientId/revoke', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { clientId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: client } = await supabaseAdmin
      .from('oauth_clients')
      .select('id')
      .eq('client_id', clientId)
      .single();

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const { error: revokeError } = await supabaseAdmin
      .from('oauth_refresh_tokens')
      .update({ revoked: true, revoked_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('client_id', client.id);

    if (revokeError) {
      console.error('[OAuth Clients API] Error revoking tokens:', revokeError);
      return res.status(500).json({ error: 'Failed to revoke access' });
    }

    const { error: codesError } = await supabaseAdmin
      .from('oauth_authorization_codes')
      .delete()
      .eq('user_id', userId)
      .eq('client_id', client.id);

    if (codesError) {
      console.error('[OAuth Clients API] Error deleting authorization codes:', codesError);
    }

    res.json({ success: true, message: `Access revoked for ${clientId}` });
  } catch (error) {
    console.error('[OAuth Clients API] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
