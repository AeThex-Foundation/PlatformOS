-- OAuth 2.0 Provider Tables for Foundation Passport System
-- This enables the Foundation to act as an authentication provider for AeThex properties
-- Implements: Authorization Code Flow with PKCE

-- Table: oauth_clients
-- Stores registered OAuth client applications (e.g., aethex.dev, aethex.sbs)
CREATE TABLE IF NOT EXISTS public.oauth_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT UNIQUE NOT NULL,
  client_secret TEXT, -- Hashed; NULL for public clients (e.g., SPAs)
  name TEXT NOT NULL, -- Display name (e.g., "AeThex Corporation")
  description TEXT,
  redirect_uris JSONB NOT NULL DEFAULT '[]', -- Array of allowed redirect URIs
  allowed_scopes TEXT[] NOT NULL DEFAULT ARRAY['openid', 'profile', 'email'], -- Scopes this client can request
  is_trusted BOOLEAN NOT NULL DEFAULT false, -- Skip consent screen if true
  is_active BOOLEAN NOT NULL DEFAULT true, -- Allow revoking client access
  logo_url TEXT, -- Client logo for consent screen
  website_url TEXT, -- Client website
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: oauth_authorization_codes
-- Temporary codes issued during authorization flow (short-lived, single-use)
CREATE TABLE IF NOT EXISTS public.oauth_authorization_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- The authorization code itself
  client_id TEXT NOT NULL REFERENCES public.oauth_clients(client_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  redirect_uri TEXT NOT NULL, -- Must match exactly on token exchange
  code_challenge TEXT, -- PKCE: S256 hash of code_verifier
  code_challenge_method TEXT, -- 'S256' or 'plain' (S256 required for security)
  scope TEXT NOT NULL DEFAULT 'openid profile email', -- Space-separated scopes
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Typically 10 minutes from creation
  used BOOLEAN NOT NULL DEFAULT false, -- Prevent replay attacks
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: oauth_refresh_tokens
-- Long-lived tokens for refreshing access tokens without re-authentication
CREATE TABLE IF NOT EXISTS public.oauth_refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL, -- The refresh token itself (hashed in production)
  client_id TEXT NOT NULL REFERENCES public.oauth_clients(client_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  scope TEXT NOT NULL DEFAULT 'openid profile email',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Typically 30-90 days
  revoked BOOLEAN NOT NULL DEFAULT false, -- Allows manual revocation
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_oauth_clients_client_id ON public.oauth_clients(client_id);
CREATE INDEX IF NOT EXISTS idx_oauth_codes_code ON public.oauth_authorization_codes(code);
CREATE INDEX IF NOT EXISTS idx_oauth_codes_user_id ON public.oauth_authorization_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_codes_expires_at ON public.oauth_authorization_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_oauth_refresh_tokens_token ON public.oauth_refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_oauth_refresh_tokens_user_id ON public.oauth_refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_refresh_tokens_client_id ON public.oauth_refresh_tokens(client_id);

-- Row Level Security (RLS) Policies
-- Note: These tables are server-side only; no direct client access

ALTER TABLE public.oauth_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_authorization_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (server-side operations)
CREATE POLICY "Service role full access to oauth_clients"
  ON public.oauth_clients FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to oauth_authorization_codes"
  ON public.oauth_authorization_codes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to oauth_refresh_tokens"
  ON public.oauth_refresh_tokens FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Users can view their own authorization codes (for debugging/auditing)
CREATE POLICY "Users can view own authorization codes"
  ON public.oauth_authorization_codes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can view their own refresh tokens (for security management)
CREATE POLICY "Users can view own refresh tokens"
  ON public.oauth_refresh_tokens FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can revoke their own refresh tokens
CREATE POLICY "Users can revoke own refresh tokens"
  ON public.oauth_refresh_tokens FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND revoked = true);

-- Cleanup function: Delete expired authorization codes (run via cron)
CREATE OR REPLACE FUNCTION public.cleanup_expired_oauth_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.oauth_authorization_codes
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup function: Delete expired refresh tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_refresh_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM public.oauth_refresh_tokens
  WHERE expires_at < NOW() OR revoked = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed initial OAuth client: AeThex Corporation (aethex.dev)
INSERT INTO public.oauth_clients (
  client_id,
  client_secret,
  name,
  description,
  redirect_uris,
  allowed_scopes,
  is_trusted,
  is_active,
  website_url
) VALUES (
  'aethex_corp',
  NULL, -- Will be set via environment variable for security
  'AeThex Corporation',
  'The official AeThex Corp development platform (aethex.dev)',
  '["https://aethex.dev/auth/callback", "http://localhost:3000/auth/callback"]',
  ARRAY['openid', 'profile', 'email', 'achievements', 'projects'],
  true, -- Trusted first-party client
  true,
  'https://aethex.dev'
) ON CONFLICT (client_id) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE public.oauth_clients IS 'Registered OAuth 2.0 client applications that can authenticate via Foundation Passport';
COMMENT ON TABLE public.oauth_authorization_codes IS 'Temporary authorization codes for OAuth 2.0 code exchange flow (PKCE)';
COMMENT ON TABLE public.oauth_refresh_tokens IS 'Long-lived tokens for obtaining new access tokens without re-authentication';
COMMENT ON COLUMN public.oauth_clients.is_trusted IS 'Trusted clients skip the consent screen (first-party apps only)';
COMMENT ON COLUMN public.oauth_authorization_codes.code_challenge IS 'PKCE code challenge (S256 hash of verifier) to prevent authorization code interception';
COMMENT ON COLUMN public.oauth_refresh_tokens.revoked IS 'Allows users to revoke access to specific applications';
