/**
 * Discord OAuth Routes
 * Foundation Discord integration endpoints
 */

import { Router, Request, Response } from 'express';
import { adminSupabase } from '../supabase';

const router = Router();

// Discord API response types
interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email: string;
  verified: boolean;
  flags: number;
  banner: string | null;
  accent_color: number | null;
  premium_type: number;
  public_flags: number;
}

/**
 * GET /api/discord/oauth/start
 * Initiates Discord OAuth flow
 */
router.get('/oauth/start', (req: Request, res: Response) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  
  if (!clientId) {
    return res.status(500).json({ error: 'Discord client ID not configured' });
  }

  // Use Foundation domain for redirect
  const apiBase = process.env.VITE_API_BASE || 'https://aethex.foundation';
  const redirectUri = `${apiBase}/api/discord/oauth/callback`;

  // Get state from query params (can be JSON string with action and redirectTo)
  const state = req.query.state || '/dashboard';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify email',
    state: typeof state === 'string' ? state : '/dashboard',
  });

  const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  res.redirect(discordOAuthUrl);
});

/**
 * GET /api/discord/oauth/callback
 * Handles Discord OAuth callback
 */
router.get('/oauth/callback', async (req: Request, res: Response) => {
  const { code, state, error } = req.query;

  // Handle Discord error
  if (error) {
    return res.redirect(`/login?error=${error}`);
  }

  if (!code) {
    return res.redirect('/login?error=no_code');
  }

  // Parse state to determine if this is a linking or login flow
  let isLinkingFlow = false;
  let redirectTo = '/dashboard';
  let authenticatedUserId: string | null = null;

  if (state) {
    try {
      const stateData = JSON.parse(decodeURIComponent(state as string));
      isLinkingFlow = stateData.action === 'link';
      redirectTo = stateData.redirectTo || redirectTo;

      // For linking flow, extract user ID from temporary session
      if (isLinkingFlow && stateData.sessionToken) {
        const { data: session, error: sessionError } = await adminSupabase
          .from('discord_linking_sessions')
          .select('user_id')
          .eq('session_token', stateData.sessionToken)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (sessionError || !session) {
          console.error('[Discord OAuth] Linking session not found or expired', sessionError);
          return res.redirect('/login?error=session_lost&message=Session%20expired.%20Please%20try%20linking%20Discord%20again.');
        }

        authenticatedUserId = session.user_id;
        console.log('[Discord OAuth] Linking session found, user_id:', authenticatedUserId);

        // Clean up temporary session
        await adminSupabase
          .from('discord_linking_sessions')
          .delete()
          .eq('session_token', stateData.sessionToken);
      }
    } catch (e) {
      console.log('[Discord OAuth] Could not parse state:', e);
    }
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('[Discord OAuth] Missing Discord credentials');
    return res.redirect('/login?error=config');
  }

  try {
    const apiBase = process.env.VITE_API_BASE || 'https://aethex.foundation';
    const redirectUri = `${apiBase}/api/discord/oauth/callback`;

    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: String(code),
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('[Discord OAuth] Token exchange failed:', errorData);
      return res.redirect('/login?error=token_exchange');
    }

    const tokenData = await tokenResponse.json() as DiscordTokenResponse;

    // Fetch Discord user profile
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userResponse.ok) {
      console.error('[Discord OAuth] User fetch failed:', userResponse.status);
      return res.redirect('/login?error=user_fetch');
    }

    const discordUser = await userResponse.json() as DiscordUser;

    // Validate Discord user has email
    if (!discordUser.email) {
      console.error('[Discord OAuth] Discord user has no email');
      return res.redirect('/login?error=no_email&message=Please+enable+email+on+your+Discord+account');
    }

    // LINKING FLOW: Link Discord to authenticated user
    if (isLinkingFlow && authenticatedUserId) {
      console.log('[Discord OAuth] Linking Discord to user:', authenticatedUserId);

      // Check if Discord ID is already linked to someone else
      const { data: existingLink } = await adminSupabase
        .from('discord_links')
        .select('user_id')
        .eq('discord_id', discordUser.id)
        .single();

      if (existingLink && existingLink.user_id !== authenticatedUserId) {
        console.error('[Discord OAuth] Discord ID already linked to different user');
        return res.redirect(`/dashboard?error=already_linked&message=${encodeURIComponent('This Discord account is already linked to another AeThex account')}`);
      }

      // Create or update Discord link
      const { error: linkError } = await adminSupabase.from('discord_links').upsert({
        discord_id: String(discordUser.id),
        user_id: authenticatedUserId,
        linked_at: new Date().toISOString(),
      });

      if (linkError) {
        console.error('[Discord OAuth] Link creation failed:', linkError);
        return res.redirect(`/dashboard?error=link_failed&message=${encodeURIComponent('Failed to link Discord account')}`);
      }

      console.log('[Discord OAuth] Successfully linked Discord:', discordUser.id);

      // Send notification (optional - create if notifications table exists)
      await notifyAccountLinked(authenticatedUserId, 'Discord');
      
      return res.redirect(redirectTo);
    }

    // LOGIN FLOW: Don't auto-create accounts
    const { data: existingLink } = await adminSupabase
      .from('discord_links')
      .select('user_id')
      .eq('discord_id', discordUser.id)
      .single();

    let userId: string;

    if (existingLink) {
      // Discord ID already linked - use existing user
      userId = existingLink.user_id;
      console.log('[Discord OAuth] Discord ID already linked to user:', userId);
    } else {
      // Check if email matches existing account
      const { data: existingUserProfile } = await adminSupabase
        .from('user_profiles')
        .select('id')
        .eq('email', discordUser.email)
        .single();

      if (existingUserProfile) {
        // Discord email matches existing user profile - link it
        userId = existingUserProfile.id;
        console.log('[Discord OAuth] Discord email matches existing user profile, linking Discord');
      } else {
        // Don't auto-create - ask user to sign up first
        console.log('[Discord OAuth] Discord email not found, redirecting to sign up');
        return res.redirect(`/login?error=discord_no_match&message=${encodeURIComponent(`Discord email (${discordUser.email}) not found. Please sign up first, then link Discord from settings.`)}`);
      }
    }

    // Create Discord link
    const { error: linkError } = await adminSupabase.from('discord_links').upsert({
      discord_id: String(discordUser.id),
      user_id: userId,
      linked_at: new Date().toISOString(),
    });

    if (linkError) {
      console.error('[Discord OAuth] Link creation failed:', linkError);
      return res.redirect('/login?error=link_create');
    }

    // Send notification if new link
    if (!existingLink) {
      await notifyAccountLinked(userId, 'Discord');
    }

    // Redirect to login for user to sign in
    console.log('[Discord OAuth] Discord linked successfully, redirecting to login');
    return res.redirect(`/login?discord_linked=true&email=${encodeURIComponent(discordUser.email)}`);
  } catch (error) {
    console.error('[Discord OAuth] Callback error:', error);
    res.redirect('/login?error=unknown');
  }
});

/**
 * POST /api/discord/verify-code
 * Verifies 6-digit Discord verification code
 */
router.post('/verify-code', async (req: Request, res: Response) => {
  const { verification_code, user_id } = req.body;

  if (!verification_code || !user_id) {
    return res.status(400).json({ message: 'Missing verification code or user ID' });
  }

  try {
    // Find valid verification code
    const { data: verification, error: verifyError } = await adminSupabase
      .from('discord_verifications')
      .select('*')
      .eq('verification_code', verification_code.trim())
      .gt('expires_at', new Date().toISOString())
      .single();

    if (verifyError || !verification) {
      console.error('[Discord Verify] Code lookup failed:', verifyError);
      return res.status(400).json({
        message: 'Invalid or expired verification code. Please try /verify again.',
        error: verifyError?.message,
      });
    }

    const discordId = verification.discord_id;

    // Check if already linked to someone else
    const { data: existingLink } = await adminSupabase
      .from('discord_links')
      .select('*')
      .eq('discord_id', discordId)
      .single();

    if (existingLink && existingLink.user_id !== user_id) {
      return res.status(400).json({
        message: 'This Discord account is already linked to another AeThex account.',
      });
    }

    // Create or update link
    const { error: linkError } = await adminSupabase.from('discord_links').upsert({
      discord_id: discordId,
      user_id: user_id,
      linked_at: new Date().toISOString(),
    });

    if (linkError) {
      console.error('[Discord Verify] Link creation failed:', linkError);
      return res.status(500).json({ message: 'Failed to link Discord account' });
    }

    // Delete used verification code
    await adminSupabase
      .from('discord_verifications')
      .delete()
      .eq('verification_code', verification_code.trim());

    res.status(200).json({
      success: true,
      message: 'Discord account linked successfully!',
      discord_user: {
        id: discordId,
        username: verification.username || 'Discord User',
        discriminator: '0000',
      },
    });
  } catch (error) {
    console.error('[Discord Verify] Error:', error);
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
});

/**
 * POST /api/discord/link
 * Links Discord account using verification code
 */
router.post('/link', async (req: Request, res: Response) => {
  const { verification_code, user_id } = req.body;

  if (!verification_code || !user_id) {
    return res.status(400).json({ error: 'verification_code and user_id are required' });
  }

  try {
    // Find verification code
    const { data: verification, error: verifyError } = await adminSupabase
      .from('discord_verifications')
      .select('*')
      .eq('verification_code', verification_code)
      .single();

    if (verifyError || !verification) {
      return res.status(401).json({ error: 'Invalid verification code' });
    }

    // Check if expired
    const expiresAt = new Date(String(verification.expires_at));
    if (expiresAt < new Date()) {
      await adminSupabase
        .from('discord_verifications')
        .delete()
        .eq('verification_code', verification_code);

      return res.status(401).json({ error: 'Verification code has expired' });
    }

    // Verify user exists
    const { data: userData, error: userError } = await adminSupabase
      .from('user_profiles')
      .select('id')
      .eq('id', user_id)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if Discord ID is already linked
    const { data: existingLink } = await adminSupabase
      .from('discord_links')
      .select('*')
      .eq('discord_id', verification.discord_id)
      .single();

    if (existingLink) {
      return res.status(409).json({
        error: 'This Discord account is already linked to another AeThex account',
      });
    }

    // Create the link
    const { error: linkError } = await adminSupabase.from('discord_links').insert({
      discord_id: verification.discord_id,
      user_id,
    });

    if (linkError) {
      console.error('Failed to create discord link:', linkError);
      return res.status(500).json({ error: 'Failed to link Discord account' });
    }

    // Delete used verification code
    await adminSupabase
      .from('discord_verifications')
      .delete()
      .eq('verification_code', verification_code);

    return res.status(200).json({
      success: true,
      message: 'Discord account linked successfully',
      discord_id: verification.discord_id,
    });
  } catch (error: any) {
    console.error('Discord link error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to link Discord account',
    });
  }
});

/**
 * POST /api/discord/create-linking-session
 * Creates temporary linking session for OAuth flow
 */
router.post('/create-linking-session', async (req: Request, res: Response) => {
  // Ensure user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Not authenticated. Please log in first.' });
  }

  const userId = req.user.id;

  try {
    // Generate random session token
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const { error } = await adminSupabase.from('discord_linking_sessions').insert({
      user_id: userId,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      console.error('[Discord] Failed to create linking session:', error);
      return res.status(500).json({ error: 'Failed to create linking session' });
    }

    return res.status(200).json({ session_token: sessionToken });
  } catch (error) {
    console.error('[Discord] Create linking session error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to send notifications (non-blocking)
async function notifyAccountLinked(userId: string, provider: string): Promise<void> {
  try {
    await adminSupabase.from('notifications').insert({
      user_id: userId,
      type: 'success',
      title: `🔗 Account Linked: ${provider}`,
      message: `Your ${provider} account has been successfully linked.`,
    });
  } catch (error) {
    console.warn('Failed to create notification:', error);
    // Non-blocking - don't throw
  }
}

export default router;
