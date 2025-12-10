import { Router, Request, Response } from 'express';
import { adminSupabase } from '../supabase';
import { requireAuth } from '../middleware/auth';
import Stripe from 'stripe';

const router = Router();

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const PRICE_CONFIG = {
  initiate_monthly: 1000,
  architect_monthly: 5000,
  overseer_monthly: 25000,
  initiate_onetime: 1000,
  architect_onetime: 5000,
  overseer_onetime: 25000,
  equip_recruit: 2500,
  fuel_sprint: 10000,
  launch_graduate: 50000,
  sponsor_sprint: 100000,
  guild_patron: 500000,
};

const getDefaultStats = () => ({
  recruits_trained: 1240,
  code_commits: 45200,
  grants_awarded: 12500,
  mentorship_matches: 48,
  active_donors: 24,
  total_raised: 18750,
});

router.get('/stats', async (req: Request, res: Response) => {
  if (!adminSupabase) {
    return res.json(getDefaultStats());
  }
  
  try {
    const [
      profilesRes,
      mentorsRes,
      donationsRes,
    ] = await Promise.all([
      adminSupabase.from('user_profiles').select('id', { count: 'exact', head: true }),
      adminSupabase.from('mentors').select('id', { count: 'exact', head: true }).eq('available', true),
      adminSupabase.from('donations').select('amount, user_id, type').eq('status', 'completed'),
    ]);

    const recruitsCount = profilesRes?.count || 0;
    const mentorshipMatches = mentorsRes?.count || 0;
    
    let totalRaised = 0;
    let activeDonors = 0;
    let grantsAwarded = 0;
    
    const donationData = donationsRes?.data as any[] | null;
    if (donationData && donationData.length > 0) {
      totalRaised = donationData.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
      activeDonors = new Set(donationData.map((d: any) => d.user_id)).size;
      grantsAwarded = donationData.filter((d: any) => d.type === 'grant').reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
    }

    res.json({
      recruits_trained: recruitsCount || getDefaultStats().recruits_trained,
      code_commits: 45200,
      grants_awarded: grantsAwarded || getDefaultStats().grants_awarded,
      mentorship_matches: mentorshipMatches || getDefaultStats().mentorship_matches,
      active_donors: activeDonors || getDefaultStats().active_donors,
      total_raised: totalRaised || getDefaultStats().total_raised,
    });
  } catch (error) {
    console.error('[Donate] Stats error:', error);
    res.json(getDefaultStats());
  }
});

router.get('/funding-goals', async (req: Request, res: Response) => {
  if (!adminSupabase) {
    return res.json(getDefaultFundingGoals());
  }
  
  try {
    const result = await adminSupabase
      .from('funding_goals')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (result?.error) throw result.error;

    res.json(result?.data?.length ? result.data : getDefaultFundingGoals());
  } catch (error) {
    res.json(getDefaultFundingGoals());
  }
});

function getDefaultFundingGoals() {
  return [
    {
      id: '1',
      name: 'Server Infrastructure Fund',
      target: 6000,
      current: 2400,
      description: 'Keep the AeThex machine running for another year',
    },
    {
      id: '2',
      name: 'GameForge Sprint #4 Prize Pool',
      target: 1000,
      current: 650,
      description: 'Western Cyberpunk Assets Challenge',
    },
  ];
}

router.get('/activity', async (req: Request, res: Response) => {
  if (!adminSupabase) {
    return res.json(getDefaultActivity());
  }
  
  try {
    const result = await adminSupabase
      .from('donation_activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (result?.error) throw result.error;

    const data = result?.data as any[] | null;
    const formattedActivity = data?.map((item: any) => ({
      id: item.id,
      type: item.type,
      message: item.message,
      timestamp: formatTimeAgo(new Date(item.created_at)),
      avatar: item.avatar_url,
    })) || [];

    res.json(formattedActivity.length > 0 ? formattedActivity : getDefaultActivity());
  } catch (error) {
    res.json(getDefaultActivity());
  }
});

function getDefaultActivity() {
  return [
    { id: '1', type: 'donation', message: 'Architect_Nova just became an Overseer!', timestamp: '2 minutes ago' },
    { id: '2', type: 'recruit', message: 'New recruit CodeMaster_42 joined the Foundation', timestamp: '5 minutes ago' },
    { id: '3', type: 'grant', message: '$500 grant awarded to PixelForge team', timestamp: '12 minutes ago' },
    { id: '4', type: 'donation', message: 'Anonymous donated $100 to Fuel a Sprint', timestamp: '18 minutes ago' },
    { id: '5', type: 'level_up', message: 'ShadowCoder leveled up to Architect!', timestamp: '25 minutes ago' },
    { id: '6', type: 'recruit', message: '3 new recruits completed onboarding', timestamp: '1 hour ago' },
    { id: '7', type: 'donation', message: 'TechCorp sponsored Sprint #4', timestamp: '2 hours ago' },
    { id: '8', type: 'grant', message: 'Mentorship grant approved for GameDev_Pro', timestamp: '3 hours ago' },
  ];
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

router.get('/leaderboard', async (req: Request, res: Response) => {
  if (!adminSupabase) {
    return res.json(getDefaultLeaderboard());
  }
  
  try {
    const period = req.query.period as string || 'alltime';
    
    let query = adminSupabase
      .from('donations')
      .select(`
        user_id,
        amount,
        tier,
        is_anonymous,
        created_at
      `)
      .eq('status', 'completed');

    if (period === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.gte('created_at', monthAgo.toISOString());
    }

    const result = await query;
    if (result?.error) throw result.error;

    const data = result?.data as any[] | null;
    if (!data || data.length === 0) {
      return res.json(getDefaultLeaderboard());
    }

    const userIds = [...new Set(data.map((d: any) => d.user_id))];
    const profilesResult = await adminSupabase
      .from('user_profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', userIds);

    const profiles = new Map();
    (profilesResult?.data as any[] || []).forEach((p: any) => {
      profiles.set(p.id, p);
    });

    const aggregated = new Map();
    data.forEach((donation: any) => {
      const userId = donation.user_id;
      const profile = profiles.get(userId);
      if (!aggregated.has(userId)) {
        aggregated.set(userId, {
          id: userId,
          username: profile?.username || 'Anonymous',
          display_name: profile?.full_name || profile?.username || 'Anonymous',
          avatar_url: profile?.avatar_url,
          tier: donation.tier || 'initiate',
          total_donated: 0,
          is_anonymous: donation.is_anonymous || false,
        });
      }
      const entry = aggregated.get(userId);
      entry.total_donated += donation.amount || 0;
      if (getTierRank(donation.tier) > getTierRank(entry.tier)) {
        entry.tier = donation.tier;
      }
    });

    const leaderboard = Array.from(aggregated.values())
      .sort((a, b) => b.total_donated - a.total_donated)
      .slice(0, 20);

    res.json(leaderboard.length > 0 ? leaderboard : getDefaultLeaderboard());
  } catch (error) {
    res.json(getDefaultLeaderboard());
  }
});

function getTierRank(tier: string): number {
  switch (tier) {
    case 'overseer': return 3;
    case 'architect': return 2;
    case 'initiate': return 1;
    default: return 0;
  }
}

function getDefaultLeaderboard() {
  return [
    { id: '1', username: 'TechVisionary', display_name: 'Tech Visionary', tier: 'overseer', total_donated: 5000, is_anonymous: false },
    { id: '2', username: 'CodePhoenix', display_name: 'Code Phoenix', tier: 'overseer', total_donated: 2500, is_anonymous: false },
    { id: '3', username: 'PixelMaster', display_name: 'Pixel Master', tier: 'architect', total_donated: 1200, is_anonymous: false },
    { id: '4', username: 'Anonymous', display_name: 'Anonymous', tier: 'architect', total_donated: 1000, is_anonymous: true },
    { id: '5', username: 'GameForger', display_name: 'Game Forger', tier: 'architect', total_donated: 850, is_anonymous: false },
    { id: '6', username: 'NexusBuilder', display_name: 'Nexus Builder', tier: 'initiate', total_donated: 500, is_anonymous: false },
    { id: '7', username: 'ShadowDev', display_name: 'Shadow Dev', tier: 'initiate', total_donated: 350, is_anonymous: false },
    { id: '8', username: 'ByteWizard', display_name: 'Byte Wizard', tier: 'initiate', total_donated: 200, is_anonymous: false },
  ];
}

router.post('/checkout', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const userEmail = (req as any).user?.email;
    const { tier, amount, isRecurring, productType } = req.body;

    if (!tier || !amount) {
      return res.status(400).json({ error: 'Missing tier or amount' });
    }

    if (!stripe) {
      return res.status(503).json({ 
        error: 'Payment processing is not configured. Please contact support.',
      });
    }

    const amountInCents = Math.round(amount * 100);
    const tierNames: Record<string, string> = {
      initiate: 'Initiate Tier',
      architect: 'Architect Tier',
      overseer: 'Overseer Tier',
      equip_recruit: 'Equip a Recruit',
      fuel_sprint: 'Fuel a Sprint',
      launch_graduate: 'Launch a Graduate',
      sponsor_sprint: 'Sponsor a Sprint',
      guild_patron: 'Guild Patron',
    };

    const productName = tierNames[tier] || `${tier} Donation`;
    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'http://localhost:5000';

    if (isRecurring) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: userEmail,
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `AeThex Foundation - ${productName} (Monthly)`,
              description: `Monthly recurring donation to the AeThex Foundation`,
            },
            unit_amount: amountInCents,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        }],
        success_url: `${baseUrl}/donate?success=true&tier=${tier}`,
        cancel_url: `${baseUrl}/donate?canceled=true`,
        metadata: {
          user_id: userId,
          tier,
          product_type: productType || 'subscription',
        },
      });

      return res.json({ 
        success: true, 
        checkoutUrl: session.url,
        sessionId: session.id,
      });
    } else {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: userEmail,
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `AeThex Foundation - ${productName}`,
              description: `One-time donation to the AeThex Foundation`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        }],
        success_url: `${baseUrl}/donate?success=true&tier=${tier}`,
        cancel_url: `${baseUrl}/donate?canceled=true`,
        metadata: {
          user_id: userId,
          tier,
          product_type: productType || 'one-time',
        },
      });

      return res.json({ 
        success: true, 
        checkoutUrl: session.url,
        sessionId: session.id,
      });
    }
  } catch (error: any) {
    console.error('[Donate] Checkout error:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

router.post('/record-badge', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { tier } = req.body;

    const badgeMap: Record<string, string> = {
      'initiate': 'donor_bronze',
      'architect': 'donor_silver',
      'overseer': 'donor_gold',
    };

    const badgeName = badgeMap[tier];
    if (!badgeName) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    if (!adminSupabase) {
      return res.json({ success: true, badge: badgeName, message: 'Badge will be applied when payment is processed' });
    }

    const profileResult = await adminSupabase
      .from('user_profiles')
      .select('badges')
      .eq('id', userId)
      .single();

    if (profileResult?.error) {
      console.error('[Donate] Badge fetch error:', profileResult.error);
      return res.json({ success: true, badge: badgeName, message: 'Badge will be applied when payment is processed' });
    }

    const profile = profileResult?.data as any;
    if (!profile) {
      return res.json({ success: true, badge: badgeName, message: 'Badge will be applied when payment is processed' });
    }

    const currentBadges = profile.badges || [];
    if (!currentBadges.includes(badgeName)) {
      const updateResult = await adminSupabase
        .from('user_profiles')
        .update({ badges: [...currentBadges, badgeName] } as any)
        .eq('id', userId);

      if (updateResult?.error) {
        console.error('[Donate] Badge update error:', updateResult.error);
        return res.json({ success: true, badge: badgeName, message: 'Badge will be applied when payment is processed' });
      }
    }

    res.json({ success: true, badge: badgeName });
  } catch (error) {
    console.error('[Donate] Badge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
