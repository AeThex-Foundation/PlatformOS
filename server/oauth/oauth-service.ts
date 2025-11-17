/**
 * OAuth 2.0 Provider Service
 * Foundation Passport SSO Authentication Provider
 * 
 * Implements: Authorization Code Flow with PKCE (RFC 7636)
 * Endpoints: /authorize, /token, /userinfo
 */

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!;

// Service role client for server-side OAuth operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// OAuth Error Codes (RFC 6749)
export enum OAuthError {
  INVALID_REQUEST = 'invalid_request',
  UNAUTHORIZED_CLIENT = 'unauthorized_client',
  ACCESS_DENIED = 'access_denied',
  UNSUPPORTED_RESPONSE_TYPE = 'unsupported_response_type',
  INVALID_SCOPE = 'invalid_scope',
  SERVER_ERROR = 'server_error',
  TEMPORARILY_UNAVAILABLE = 'temporarily_unavailable',
  INVALID_CLIENT = 'invalid_client',
  INVALID_GRANT = 'invalid_grant',
  UNSUPPORTED_GRANT_TYPE = 'unsupported_grant_type',
}

export interface OAuthClient {
  id: string;
  client_id: string;
  client_secret: string | null;
  name: string;
  description: string | null;
  redirect_uris: string[];
  allowed_scopes: string[];
  is_trusted: boolean;
  is_active: boolean;
  logo_url: string | null;
  website_url: string | null;
}

export interface AuthorizationCode {
  code: string;
  client_id: string;
  user_id: string;
  redirect_uri: string;
  code_challenge: string | null;
  code_challenge_method: string | null;
  scope: string;
  expires_at: string;
}

export interface RefreshToken {
  token: string;
  client_id: string;
  user_id: string;
  scope: string;
  expires_at: string;
}

/**
 * Generates a cryptographically secure random string
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

/**
 * Validates that a redirect URI is allowed for a client
 */
export function validateRedirectUri(client: OAuthClient, redirectUri: string): boolean {
  // Exact match required for security
  return client.redirect_uris.includes(redirectUri);
}

/**
 * Validates that requested scopes are allowed for a client
 */
export function validateScopes(client: OAuthClient, requestedScopes: string): boolean {
  const scopes = requestedScopes.split(' ').filter(Boolean);
  return scopes.every(scope => client.allowed_scopes.includes(scope));
}

/**
 * Verifies PKCE code challenge
 * Computes S256(code_verifier) and compares to stored code_challenge
 */
export function verifyPKCE(codeVerifier: string, codeChallenge: string, method: string = 'S256'): boolean {
  if (method === 'plain') {
    return codeVerifier === codeChallenge;
  }
  
  if (method === 'S256') {
    const computed = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');
    return computed === codeChallenge;
  }
  
  return false;
}

/**
 * Fetches an OAuth client by client_id
 */
export async function getOAuthClient(clientId: string): Promise<OAuthClient | null> {
  const { data, error } = await supabaseAdmin
    .from('oauth_clients')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    redirect_uris: Array.isArray(data.redirect_uris) 
      ? data.redirect_uris 
      : JSON.parse(data.redirect_uris as string),
  };
}

/**
 * Creates an authorization code
 */
export async function createAuthorizationCode(params: {
  clientId: string;
  userId: string;
  redirectUri: string;
  codeChallenge: string | null;
  codeChallengeMethod: string | null;
  scope: string;
}): Promise<string> {
  const code = generateSecureToken(32);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const { error } = await supabaseAdmin
    .from('oauth_authorization_codes')
    .insert({
      code,
      client_id: params.clientId,
      user_id: params.userId,
      redirect_uri: params.redirectUri,
      code_challenge: params.codeChallenge,
      code_challenge_method: params.codeChallengeMethod,
      scope: params.scope,
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    console.error('Failed to create authorization code:', error);
    throw new Error('Failed to create authorization code');
  }

  return code;
}

/**
 * Validates and consumes an authorization code
 * Returns null if invalid, expired, or already used
 */
export async function consumeAuthorizationCode(
  code: string,
  clientId: string,
  redirectUri: string,
  codeVerifier: string | null
): Promise<AuthorizationCode | null> {
  // Fetch the authorization code
  const { data, error } = await supabaseAdmin
    .from('oauth_authorization_codes')
    .select('*')
    .eq('code', code)
    .eq('client_id', clientId)
    .single();

  if (error || !data) {
    return null;
  }

  // Check if already used
  if (data.used) {
    console.warn('Authorization code already used:', code);
    return null;
  }

  // Check if expired
  if (new Date(data.expires_at) < new Date()) {
    console.warn('Authorization code expired:', code);
    return null;
  }

  // Verify redirect URI matches
  if (data.redirect_uri !== redirectUri) {
    console.warn('Redirect URI mismatch:', { expected: data.redirect_uri, received: redirectUri });
    return null;
  }

  // Verify PKCE if present
  if (data.code_challenge && codeVerifier) {
    const isValid = verifyPKCE(codeVerifier, data.code_challenge, data.code_challenge_method || 'S256');
    if (!isValid) {
      console.warn('PKCE verification failed');
      return null;
    }
  } else if (data.code_challenge && !codeVerifier) {
    console.warn('Code verifier required but not provided');
    return null;
  }

  // Mark as used (prevent replay attacks)
  await supabaseAdmin
    .from('oauth_authorization_codes')
    .update({ used: true })
    .eq('code', code);

  return data as AuthorizationCode;
}

/**
 * Creates a refresh token
 */
export async function createRefreshToken(params: {
  clientId: string;
  userId: string;
  scope: string;
}): Promise<string> {
  const token = generateSecureToken(48);
  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days

  const { error } = await supabaseAdmin
    .from('oauth_refresh_tokens')
    .insert({
      token,
      client_id: params.clientId,
      user_id: params.userId,
      scope: params.scope,
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    console.error('Failed to create refresh token:', error);
    throw new Error('Failed to create refresh token');
  }

  return token;
}

/**
 * Validates a refresh token and returns user info
 */
export async function validateRefreshToken(
  token: string,
  clientId: string
): Promise<RefreshToken | null> {
  const { data, error } = await supabaseAdmin
    .from('oauth_refresh_tokens')
    .select('*')
    .eq('token', token)
    .eq('client_id', clientId)
    .eq('revoked', false)
    .single();

  if (error || !data) {
    return null;
  }

  // Check if expired
  if (new Date(data.expires_at) < new Date()) {
    return null;
  }

  // Update last_used_at
  await supabaseAdmin
    .from('oauth_refresh_tokens')
    .update({ last_used_at: new Date().toISOString() })
    .eq('token', token);

  return data as RefreshToken;
}

/**
 * Generates a JWT access token
 * Contains user ID, client ID, scopes, and expiration
 */
export function generateAccessToken(params: {
  userId: string;
  clientId: string;
  scope: string;
}): string {
  // For production: Use proper JWT library (jsonwebtoken)
  // For MVP: Use base64-encoded payload (NOT SECURE - REPLACE IN PRODUCTION)
  const payload = {
    sub: params.userId,
    client_id: params.clientId,
    scope: params.scope,
    iss: 'https://aethex.foundation',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
  };

  // TODO: Replace with proper JWT signing using RS256
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

/**
 * Validates and decodes an access token
 * Returns null if invalid or expired
 */
export function validateAccessToken(token: string): any | null {
  try {
    // TODO: Replace with proper JWT verification using RS256
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString());
    
    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

/**
 * Fetches user profile for OAuth response
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('id, username, full_name, avatar_url, bio, email, github_url, twitter_url, linkedin_url')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
