import express, { Request, Response } from 'express';
import { adminSupabase } from '../supabase';
import crypto from 'crypto';

const router = express.Router();

const checkAdminRole = async (req: Request, res: Response): Promise<boolean> => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return false;
  }

  const { data: profile } = await adminSupabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  const role = (profile as any)?.role?.toLowerCase() || '';
  if (!['owner', 'admin', 'founder', 'staff'].includes(role)) {
    res.status(403).json({ error: 'Admin access required' });
    return false;
  }

  return true;
};

router.get('/', async (req: Request, res: Response) => {
  try {
    if (!await checkAdminRole(req, res)) return;

    const { data: clients, error } = await adminSupabase
      .from('oauth_clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin OAuth] Error fetching clients:', error);
      return res.status(500).json({ error: 'Failed to fetch OAuth clients' });
    }

    const normalizeRedirectUris = (uris: unknown): string[] => {
      if (Array.isArray(uris)) return uris;
      if (typeof uris === 'string') {
        try {
          const parsed = JSON.parse(uris);
          return Array.isArray(parsed) ? parsed : [uris];
        } catch {
          return [uris];
        }
      }
      return [];
    };

    const clientsWithStats = await Promise.all((clients || []).map(async (client: any) => {
      const { count: tokenCount } = await adminSupabase
        .from('oauth_refresh_tokens')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', client.client_id)
        .eq('revoked', false);

      const { count: userCount } = await adminSupabase
        .from('oauth_refresh_tokens')
        .select('user_id', { count: 'exact', head: true })
        .eq('client_id', client.client_id)
        .eq('revoked', false);

      return {
        id: client.id,
        client_id: client.client_id,
        client_secret: client.client_secret ? '••••••••••••••••' : null,
        name: client.name,
        description: client.description,
        redirect_uris: normalizeRedirectUris(client.redirect_uris),
        website: client.website_url,
        logo_url: client.logo_url,
        approved: client.is_active,
        is_trusted: client.is_trusted,
        created_at: client.created_at,
        created_by: client.is_trusted ? 'Foundation' : 'External',
        total_users: userCount || 0,
        total_logins: tokenCount || 0,
      };
    }));

    res.json({ clients: clientsWithStats });
  } catch (error) {
    console.error('[Admin OAuth] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    if (!await checkAdminRole(req, res)) return;

    const { name, description, redirect_uris, website, logo_url, is_trusted } = req.body;

    if (!name || !redirect_uris || !Array.isArray(redirect_uris) || redirect_uris.length === 0) {
      return res.status(400).json({ error: 'Name and at least one redirect URI are required' });
    }

    const clientId = `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${crypto.randomBytes(4).toString('hex')}`;
    const clientSecret = `sk_${crypto.randomBytes(32).toString('hex')}`;

    const { data: newClient, error } = await adminSupabase
      .from('oauth_clients')
      .insert({
        client_id: clientId,
        client_secret: clientSecret,
        name,
        description: description || '',
        redirect_uris: redirect_uris,
        website_url: website || '',
        logo_url: logo_url || null,
        is_trusted: is_trusted || false,
        is_active: true,
        allowed_scopes: ['openid', 'profile', 'email'],
      } as any)
      .select()
      .single();

    if (error) {
      console.error('[Admin OAuth] Error creating client:', error);
      return res.status(500).json({ error: 'Failed to create OAuth client' });
    }

    const client = newClient as any;
    res.status(201).json({
      client: {
        id: client?.id,
        client_id: clientId,
        client_secret: clientSecret,
        name: client?.name,
        description: client?.description,
        redirect_uris: redirect_uris,
        website: client?.website_url,
        logo_url: client?.logo_url,
        approved: client?.is_active,
        is_trusted: client?.is_trusted,
        created_at: client?.created_at,
        created_by: 'Admin',
        total_users: 0,
        total_logins: 0,
      },
    });
  } catch (error) {
    console.error('[Admin OAuth] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/approve', async (req: Request, res: Response) => {
  try {
    if (!await checkAdminRole(req, res)) return;

    const { id } = req.params;

    const { error } = await adminSupabase
      .from('oauth_clients')
      .update({ is_active: true, updated_at: new Date().toISOString() } as any)
      .eq('id', id);

    if (error) {
      console.error('[Admin OAuth] Error approving client:', error);
      return res.status(500).json({ error: 'Failed to approve OAuth client' });
    }

    res.json({ success: true, message: 'Client approved successfully' });
  } catch (error) {
    console.error('[Admin OAuth] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/revoke', async (req: Request, res: Response) => {
  try {
    if (!await checkAdminRole(req, res)) return;

    const { id } = req.params;

    const { data: client } = await adminSupabase
      .from('oauth_clients')
      .select('client_id')
      .eq('id', id)
      .single();

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const { error: updateError } = await adminSupabase
      .from('oauth_clients')
      .update({ is_active: false, updated_at: new Date().toISOString() } as any)
      .eq('id', id);

    if (updateError) {
      console.error('[Admin OAuth] Error revoking client:', updateError);
      return res.status(500).json({ error: 'Failed to revoke OAuth client' });
    }

    await adminSupabase
      .from('oauth_refresh_tokens')
      .update({ revoked: true, revoked_at: new Date().toISOString() } as any)
      .eq('client_id', (client as any).client_id);

    res.json({ success: true, message: 'Client revoked successfully' });
  } catch (error) {
    console.error('[Admin OAuth] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!await checkAdminRole(req, res)) return;

    const { id } = req.params;

    const { error } = await adminSupabase
      .from('oauth_clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Admin OAuth] Error deleting client:', error);
      return res.status(500).json({ error: 'Failed to delete OAuth client' });
    }

    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error('[Admin OAuth] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
