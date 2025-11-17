/**
 * OAuth 2.0 Provider Routes
 * Foundation Passport SSO Endpoints
 * 
 * Implements:
 * - GET /api/oauth/authorize - Authorization endpoint
 * - POST /api/oauth/token - Token exchange endpoint
 * - GET /api/oauth/userinfo - User info endpoint
 */

import { Router, Request, Response } from 'express';
import {
  getOAuthClient,
  validateRedirectUri,
  validateScopes,
  createAuthorizationCode,
  consumeAuthorizationCode,
  createRefreshToken,
  generateAccessToken,
  validateAccessToken,
  getUserProfile,
  validateRefreshToken,
  OAuthError,
} from './oauth-service.js';

const router = Router();

/**
 * GET /api/oauth/authorize
 * 
 * Authorization endpoint - handles OAuth 2.0 authorization requests
 * 
 * Query parameters:
 * - response_type: Must be 'code' (authorization code flow)
 * - client_id: The OAuth client identifier
 * - redirect_uri: Where to redirect after authorization
 * - scope: Space-separated list of requested scopes
 * - state: CSRF protection token (recommended)
 * - code_challenge: PKCE challenge (recommended)
 * - code_challenge_method: 'S256' or 'plain' (S256 recommended)
 * 
 * Flow:
 * 1. Validate client and parameters
 * 2. Check if user is authenticated (via session)
 * 3. If trusted client or user already consented, auto-approve
 * 4. Otherwise, show consent screen
 * 5. Generate authorization code
 * 6. Redirect to client's redirect_uri with code
 */
router.get('/authorize', async (req: Request, res: Response) => {
  try {
    const {
      response_type,
      client_id,
      redirect_uri,
      scope = 'openid profile email',
      state,
      code_challenge,
      code_challenge_method = 'S256',
    } = req.query;

    // Validate required parameters
    if (response_type !== 'code') {
      return res.status(400).json({
        error: OAuthError.UNSUPPORTED_RESPONSE_TYPE,
        error_description: 'Only authorization code flow (response_type=code) is supported',
      });
    }

    if (!client_id || typeof client_id !== 'string') {
      return res.status(400).json({
        error: OAuthError.INVALID_REQUEST,
        error_description: 'client_id is required',
      });
    }

    if (!redirect_uri || typeof redirect_uri !== 'string') {
      return res.status(400).json({
        error: OAuthError.INVALID_REQUEST,
        error_description: 'redirect_uri is required',
      });
    }

    // Fetch OAuth client
    const client = await getOAuthClient(client_id);
    if (!client) {
      return res.status(400).json({
        error: OAuthError.INVALID_CLIENT,
        error_description: 'Invalid or inactive client_id',
      });
    }

    // Validate redirect URI
    if (!validateRedirectUri(client, redirect_uri)) {
      return res.status(400).json({
        error: OAuthError.INVALID_REQUEST,
        error_description: 'redirect_uri not registered for this client',
      });
    }

    // Validate scopes
    if (typeof scope === 'string' && !validateScopes(client, scope)) {
      return redirectWithError(redirect_uri, state as string, OAuthError.INVALID_SCOPE, 'Requested scope not allowed');
      return;
    }

    // Check if user is authenticated via Supabase session
    const authHeader = req.headers.authorization;
    const userId = (req as any).user?.id; // Assumes auth middleware sets req.user

    if (!userId) {
      // Redirect to Foundation login with return URL
      const returnUrl = encodeURIComponent(req.originalUrl);
      return res.redirect(`/login?redirect=/api/oauth/authorize&state=${returnUrl}`);
    }

    // For trusted clients, auto-approve (skip consent screen)
    // For MVP: Auto-approve all requests (add consent screen later)
    const autoApprove = client.is_trusted || true; // TODO: Implement consent screen

    if (autoApprove) {
      // Generate authorization code
      const authCode = await createAuthorizationCode({
        clientId: client_id,
        userId,
        redirectUri: redirect_uri,
        codeChallenge: code_challenge as string || null,
        codeChallengeMethod: code_challenge_method as string || null,
        scope: scope as string,
      });

      // Redirect back to client with authorization code
      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.set('code', authCode);
      if (state) redirectUrl.searchParams.set('state', state as string);

      return res.redirect(redirectUrl.toString());
    }

    // Show consent screen (TODO: Implement consent UI)
    return res.status(501).json({
      error: OAuthError.TEMPORARILY_UNAVAILABLE,
      error_description: 'Consent screen not yet implemented',
    });

  } catch (error) {
    console.error('OAuth authorize error:', error);
    return res.status(500).json({
      error: OAuthError.SERVER_ERROR,
      error_description: 'Internal server error',
    });
  }
});

/**
 * POST /api/oauth/token
 * 
 * Token endpoint - exchanges authorization code for access token
 * 
 * Body parameters (application/x-www-form-urlencoded):
 * - grant_type: 'authorization_code' or 'refresh_token'
 * - code: Authorization code (for authorization_code grant)
 * - redirect_uri: Must match the one used in /authorize
 * - client_id: OAuth client identifier
 * - client_secret: Client secret (for confidential clients)
 * - code_verifier: PKCE verifier (for public clients)
 * - refresh_token: Refresh token (for refresh_token grant)
 * 
 * Response:
 * {
 *   access_token: string,
 *   token_type: 'Bearer',
 *   expires_in: number,
 *   refresh_token: string,
 *   scope: string
 * }
 */
router.post('/token', async (req: Request, res: Response) => {
  try {
    const {
      grant_type,
      code,
      redirect_uri,
      client_id,
      client_secret,
      code_verifier,
      refresh_token,
    } = req.body;

    // Validate grant type
    if (grant_type !== 'authorization_code' && grant_type !== 'refresh_token') {
      return res.status(400).json({
        error: OAuthError.UNSUPPORTED_GRANT_TYPE,
        error_description: 'Only authorization_code and refresh_token grants are supported',
      });
    }

    if (!client_id) {
      return res.status(400).json({
        error: OAuthError.INVALID_REQUEST,
        error_description: 'client_id is required',
      });
    }

    // Fetch OAuth client
    const client = await getOAuthClient(client_id);
    if (!client) {
      return res.status(400).json({
        error: OAuthError.INVALID_CLIENT,
        error_description: 'Invalid client_id',
      });
    }

    // Validate client secret (if confidential client)
    if (client.client_secret && client.client_secret !== client_secret) {
      return res.status(401).json({
        error: OAuthError.INVALID_CLIENT,
        error_description: 'Invalid client_secret',
      });
    }

    // Handle authorization_code grant
    if (grant_type === 'authorization_code') {
      if (!code || !redirect_uri) {
        return res.status(400).json({
          error: OAuthError.INVALID_REQUEST,
          error_description: 'code and redirect_uri are required',
        });
      }

      // Consume authorization code
      const authCode = await consumeAuthorizationCode(
        code,
        client_id,
        redirect_uri,
        code_verifier || null
      );

      if (!authCode) {
        return res.status(400).json({
          error: OAuthError.INVALID_GRANT,
          error_description: 'Invalid, expired, or already used authorization code',
        });
      }

      // Generate tokens
      const accessToken = generateAccessToken({
        userId: authCode.user_id,
        clientId: client_id,
        scope: authCode.scope,
      });

      const refreshToken = await createRefreshToken({
        clientId: client_id,
        userId: authCode.user_id,
        scope: authCode.scope,
      });

      return res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600, // 1 hour
        refresh_token: refreshToken,
        scope: authCode.scope,
      });
    }

    // Handle refresh_token grant
    if (grant_type === 'refresh_token') {
      if (!refresh_token) {
        return res.status(400).json({
          error: OAuthError.INVALID_REQUEST,
          error_description: 'refresh_token is required',
        });
      }

      // Validate refresh token
      const tokenData = await validateRefreshToken(refresh_token, client_id);
      if (!tokenData) {
        return res.status(400).json({
          error: OAuthError.INVALID_GRANT,
          error_description: 'Invalid or expired refresh token',
        });
      }

      // Generate new access token
      const accessToken = generateAccessToken({
        userId: tokenData.user_id,
        clientId: client_id,
        scope: tokenData.scope,
      });

      return res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: tokenData.scope,
      });
    }

  } catch (error) {
    console.error('OAuth token error:', error);
    return res.status(500).json({
      error: OAuthError.SERVER_ERROR,
      error_description: 'Internal server error',
    });
  }
});

/**
 * GET /api/oauth/userinfo
 * 
 * User info endpoint - returns authenticated user's profile
 * 
 * Headers:
 * - Authorization: Bearer <access_token>
 * 
 * Response (OpenID Connect standard):
 * {
 *   sub: string,        // User ID
 *   username: string,
 *   name: string,
 *   email: string,
 *   picture: string,
 *   profile: string
 * }
 */
router.get('/userinfo', async (req: Request, res: Response) => {
  try {
    // Extract access token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'invalid_token',
        error_description: 'Authorization header required',
      });
    }

    const accessToken = authHeader.substring(7);

    // Validate access token
    const tokenPayload = validateAccessToken(accessToken);
    if (!tokenPayload) {
      return res.status(401).json({
        error: 'invalid_token',
        error_description: 'Invalid or expired access token',
      });
    }

    // Fetch user profile
    const profile = await getUserProfile(tokenPayload.sub);
    if (!profile) {
      return res.status(404).json({
        error: 'user_not_found',
        error_description: 'User profile not found',
      });
    }

    // Return OpenID Connect standard userinfo
    return res.json({
      sub: profile.id,
      username: profile.username,
      name: profile.full_name,
      email: profile.email,
      picture: profile.avatar_url,
      profile: `https://aethex.foundation/${profile.username}`,
      // Additional Foundation-specific claims
      bio: profile.bio,
      github: profile.github_url,
      twitter: profile.twitter_url,
      linkedin: profile.linkedin_url,
    });

  } catch (error) {
    console.error('OAuth userinfo error:', error);
    return res.status(500).json({
      error: 'server_error',
      error_description: 'Internal server error',
    });
  }
});

/**
 * Helper: Redirect with OAuth error
 */
function redirectWithError(
  redirectUri: string,
  state: string,
  error: OAuthError,
  description: string
) {
  const url = new URL(redirectUri);
  url.searchParams.set('error', error);
  url.searchParams.set('error_description', description);
  if (state) url.searchParams.set('state', state);
  return url.toString();
}

export default router;
