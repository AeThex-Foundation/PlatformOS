-- Insert AeThex Corporation OAuth Client
-- Run this in Supabase Dashboard > SQL Editor

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
  'bcoEtyQVGr6Z4557658eUXpDF5FDni2TGNahH3HT-FtylNrLCYwydwLO0sbKVHtfYUnZc4flAODa4BXkzxD_qg',
  'AeThex Corporation',
  'The official AeThex Corp development platform (aethex.dev)',
  '["https://aethex.dev/auth/callback", "http://localhost:3000/auth/callback"]'::jsonb,
  ARRAY['openid', 'profile', 'email', 'achievements', 'projects'],
  true,
  true,
  'https://aethex.dev'
) ON CONFLICT (client_id) DO UPDATE SET
  client_secret = EXCLUDED.client_secret,
  redirect_uris = EXCLUDED.redirect_uris,
  updated_at = NOW();

-- Verify insertion
SELECT client_id, name, is_active, redirect_uris FROM oauth_clients WHERE client_id = 'aethex_corp';
