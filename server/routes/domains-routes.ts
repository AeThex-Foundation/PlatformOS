/**
 * AeThex Domain (.aethex) Management API Routes
 * Handles domain claiming, verification, and resolution
 */

import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { createPublicClient, http, formatUnits } from 'viem';
import { polygon } from 'viem/chains';
import { getFreenameClient } from '../freename/freename-client';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const AETHEX_TOKEN_ADDRESS = '0xf846380e25b34B71474543fdB28258F8477E2Cf1' as const;
const MIN_TOKEN_BALANCE = BigInt(10) ** BigInt(18); // Minimum 1 AETHEX token required (18 decimals)

const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const polygonClient = createPublicClient({
  chain: polygon,
  transport: http(),
});

/**
 * Validate subdomain format
 */
function isValidSubdomain(subdomain: string): boolean {
  const regex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
  return regex.test(subdomain.toLowerCase()) && !subdomain.includes('--');
}

/**
 * Check $AETHEX token balance on Polygon
 */
async function checkTokenBalance(walletAddress: string): Promise<bigint> {
  try {
    const balance = await polygonClient.readContract({
      address: AETHEX_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [walletAddress as `0x${string}`],
    } as any);
    return balance as bigint;
  } catch (error) {
    console.error('[Domains] Token balance check error:', error);
    return BigInt(0);
  }
}

/**
 * GET /api/domains/check/:subdomain
 * Check if a subdomain is available
 */
router.get('/check/:subdomain', async (req: Request, res: Response) => {
  try {
    const { subdomain } = req.params;
    const normalizedSubdomain = subdomain.toLowerCase().trim();

    if (!isValidSubdomain(normalizedSubdomain)) {
      return res.status(400).json({
        available: false,
        error: 'Invalid subdomain format. Use 3-63 lowercase letters, numbers, and hyphens.',
      });
    }

    // Check if already claimed in our database
    const { data: existingClaim } = await supabaseAdmin
      .from('user_profiles')
      .select('aethex_domain')
      .eq('aethex_domain', `${normalizedSubdomain}.aethex`)
      .single();

    if (existingClaim) {
      return res.json({
        available: false,
        domain: `${normalizedSubdomain}.aethex`,
        reason: 'Already claimed',
      });
    }

    // Check with Freename API
    try {
      const freename = getFreenameClient();
      const result = await freename.checkAvailability(normalizedSubdomain);
      return res.json(result);
    } catch (freenameError) {
      // If Freename API is not configured, just check our database
      return res.json({
        available: true,
        domain: `${normalizedSubdomain}.aethex`,
      });
    }
  } catch (err) {
    console.error('[Domains] Availability check error:', err);
    return res.status(500).json({ error: 'Failed to check availability' });
  }
});

/**
 * GET /api/domains/my-domain
 * Get the authenticated user's claimed domain
 */
router.get('/my-domain', async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('aethex_domain, wallet_address')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.json({
      domain: profile.aethex_domain || null,
      walletAddress: profile.wallet_address || null,
    });
  } catch (err) {
    console.error('[Domains] Get my domain error:', err);
    return res.status(500).json({ error: 'Failed to fetch domain' });
  }
});

/**
 * POST /api/domains/claim
 * Claim a .aethex subdomain (requires auth + $AETHEX tokens)
 */
router.post('/claim', async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { subdomain, walletAddress } = req.body;

    if (!subdomain || !walletAddress) {
      return res.status(400).json({ error: 'Subdomain and wallet address are required' });
    }

    const normalizedSubdomain = subdomain.toLowerCase().trim();
    const normalizedWallet = walletAddress.toLowerCase();

    // Validate subdomain format
    if (!isValidSubdomain(normalizedSubdomain)) {
      return res.status(400).json({
        error: 'Invalid subdomain format. Use 3-63 lowercase letters, numbers, and hyphens.',
      });
    }

    // Check if user already has a domain
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('aethex_domain')
      .eq('id', user.id)
      .single();

    if (existingProfile?.aethex_domain) {
      return res.status(400).json({
        error: 'You already have a domain',
        domain: existingProfile.aethex_domain,
      });
    }

    // Check if subdomain is already taken
    const { data: existingClaim } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('aethex_domain', `${normalizedSubdomain}.aethex`)
      .single();

    if (existingClaim) {
      return res.status(400).json({ error: 'This subdomain is already taken' });
    }

    // Check $AETHEX token balance
    const balance = await checkTokenBalance(normalizedWallet);
    
    if (balance < MIN_TOKEN_BALANCE) {
      return res.status(403).json({
        error: 'Insufficient $AETHEX balance',
        required: formatUnits(MIN_TOKEN_BALANCE, 18),
        current: formatUnits(balance, 18),
        message: 'You need to hold at least 1 $AETHEX token to claim a domain',
      });
    }

    // Try to mint via Freename API
    let mintResult: { success: boolean; txHash?: string; error?: string } = { 
      success: true, 
      txHash: undefined,
      error: undefined,
    };
    
    try {
      const freename = getFreenameClient();
      const result = await freename.mintSubdomain(normalizedSubdomain, normalizedWallet);
      mintResult = result;
      
      if (!mintResult.success) {
        return res.status(500).json({ 
          error: 'Failed to mint domain on-chain',
          details: mintResult.error,
        });
      }
    } catch (freenameError: any) {
      // If Freename API is not configured, we'll just store in database
      console.log('[Domains] Freename API not available, storing locally:', freenameError.message);
    }

    // Store the claimed domain in user profile
    const fullDomain = `${normalizedSubdomain}.aethex`;
    
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        aethex_domain: fullDomain,
        wallet_address: normalizedWallet,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[Domains] Failed to store domain:', updateError);
      return res.status(500).json({ error: 'Failed to save domain claim' });
    }

    return res.json({
      success: true,
      domain: fullDomain,
      txHash: mintResult.txHash,
      message: `Successfully claimed ${fullDomain}!`,
    });
  } catch (err) {
    console.error('[Domains] Claim error:', err);
    return res.status(500).json({ error: 'Failed to claim domain' });
  }
});

/**
 * GET /api/domains/balance/:walletAddress
 * Check $AETHEX token balance for a wallet
 */
router.get('/balance/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress || !walletAddress.startsWith('0x')) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const balance = await checkTokenBalance(walletAddress);
    const formattedBalance = formatUnits(balance, 18);
    const hasMinimum = balance >= MIN_TOKEN_BALANCE;

    return res.json({
      walletAddress,
      balance: formattedBalance,
      balanceRaw: balance.toString(),
      hasMinimumBalance: hasMinimum,
      minimumRequired: formatUnits(MIN_TOKEN_BALANCE, 18),
    });
  } catch (err) {
    console.error('[Domains] Balance check error:', err);
    return res.status(500).json({ error: 'Failed to check balance' });
  }
});

/**
 * GET /api/resolve/:domain
 * Resolve a .aethex domain to wallet address (public endpoint)
 */
router.get('/resolve/:domain', async (req: Request, res: Response) => {
  try {
    const { domain } = req.params;
    const normalizedDomain = domain.toLowerCase().trim();

    // First check our database
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('wallet_address, username, full_name, avatar_url')
      .eq('aethex_domain', normalizedDomain)
      .single();

    if (profile) {
      return res.json({
        domain: normalizedDomain,
        address: profile.wallet_address,
        profile: {
          username: profile.username,
          name: profile.full_name,
          avatar: profile.avatar_url,
        },
      });
    }

    // Try Freename resolution API
    try {
      const freename = getFreenameClient();
      const result = await freename.resolveDomain(normalizedDomain);
      
      if (result) {
        return res.json({
          domain: normalizedDomain,
          address: result.records.polygon || result.records.eth || result.owner,
          records: result.records,
        });
      }
    } catch (freenameError) {
      // Freename not available
    }

    return res.status(404).json({ error: 'Domain not found' });
  } catch (err) {
    console.error('[Domains] Resolution error:', err);
    return res.status(500).json({ error: 'Failed to resolve domain' });
  }
});

export default router;
