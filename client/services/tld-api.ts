import { Domain, Proposal, ProposalStatus, GrantApplication, GrantStatus } from '@/types/tld';

const API_BASE = '/api';

export const checkDomainAvailability = async (name: string): Promise<{ available: boolean; price?: number; domain?: string }> => {
  try {
    const subdomain = name.toLowerCase().replace('.aethex', '');
    const response = await fetch(`${API_BASE}/domains/check/${subdomain}`);
    const data = await response.json();
    
    if (data.available) {
      const nameOnly = subdomain;
      let price = 0.01;
      if (nameOnly.length <= 2) price = 1.0;
      else if (nameOnly.length <= 4) price = 0.1;
      
      return { available: true, price, domain: data.domain };
    }
    return { available: false, domain: data.domain };
  } catch (error) {
    console.error('Domain availability check failed:', error);
    return { available: false };
  }
};

export const getUserDomain = async (): Promise<{ domain: string | null; walletAddress: string | null }> => {
  try {
    const response = await fetch(`${API_BASE}/domains/my-domain`, {
      credentials: 'include',
    });
    if (!response.ok) return { domain: null, walletAddress: null };
    return await response.json();
  } catch (error) {
    console.error('Failed to get user domain:', error);
    return { domain: null, walletAddress: null };
  }
};

export const claimDomain = async (subdomain: string, walletAddress: string): Promise<{ success: boolean; domain?: string; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/domains/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ subdomain, walletAddress }),
    });
    return await response.json();
  } catch (error) {
    console.error('Domain claim failed:', error);
    return { success: false, error: 'Failed to claim domain' };
  }
};

export const checkTokenBalance = async (walletAddress: string): Promise<{ balance: string; hasMinimumBalance: boolean }> => {
  try {
    const response = await fetch(`${API_BASE}/domains/balance/${walletAddress}`);
    return await response.json();
  } catch (error) {
    console.error('Balance check failed:', error);
    return { balance: '0', hasMinimumBalance: false };
  }
};

export const resolveDomain = async (domain: string): Promise<{ address?: string; profile?: any } | null> => {
  try {
    const response = await fetch(`${API_BASE}/domains/resolve/${domain}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Domain resolution failed:', error);
    return null;
  }
};

export const getProposals = async (status?: string): Promise<Proposal[]> => {
  try {
    const url = status && status !== 'all' 
      ? `${API_BASE}/governance/proposals?status=${status}`
      : `${API_BASE}/governance/proposals`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      return data.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        proposer: p.proposer_name || 'Anonymous',
        status: p.status as ProposalStatus,
        votes: {
          for: p.votes_for || 0,
          against: p.votes_against || 0,
          abstain: 0,
        },
        endDate: new Date(p.end_date).getTime(),
      }));
    }
    
    return getMockProposals();
  } catch (error) {
    console.error('Failed to fetch proposals:', error);
    return getMockProposals();
  }
};

export const createProposal = async (title: string, description: string, category?: string): Promise<{ success: boolean; proposal?: Proposal; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/governance/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, description, category }),
    });
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to create proposal' };
    }
    
    return { 
      success: true, 
      proposal: {
        id: data.id,
        title: data.title,
        description: data.description,
        proposer: data.proposer_name,
        status: data.status as ProposalStatus,
        votes: { for: 0, against: 0, abstain: 0 },
        endDate: new Date(data.end_date).getTime(),
      }
    };
  } catch (error) {
    console.error('Failed to create proposal:', error);
    return { success: false, error: 'Network error' };
  }
};

export const submitVote = async (proposalId: string, vote: 'for' | 'against', votingPower?: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/governance/proposals/${proposalId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ vote, votingPower: votingPower || 1 }),
    });
    return await response.json();
  } catch (error) {
    console.error('Vote submission failed:', error);
    return { success: false, error: 'Network error' };
  }
};

export const getTreasuryBalance = async (): Promise<{ balance: number; currency: string }> => {
  try {
    const response = await fetch(`${API_BASE}/governance/treasury`);
    const data = await response.json();
    return { balance: data.balance || 1250450, currency: data.currency || 'USDC' };
  } catch (error) {
    console.error('Failed to fetch treasury:', error);
    return { balance: 1250450, currency: 'USDC' };
  }
};

export const submitGrantApplication = async (app: { projectName: string; teamDetails: string; projectDescription: string; fundingAmount: number; applicantAddress?: string }): Promise<{ success: boolean; grant?: GrantApplication; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/grants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(app),
    });
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to submit application' };
    }
    
    return { 
      success: true,
      grant: {
        id: data.grant?.id || data.id,
        projectName: data.grant?.project_name || app.projectName,
        teamDetails: data.grant?.team_details || app.teamDetails,
        projectDescription: data.grant?.project_description || app.projectDescription,
        fundingAmount: data.grant?.funding_amount || app.fundingAmount,
        applicantAddress: data.grant?.applicant_address || app.applicantAddress || '',
        status: (data.grant?.status || 'Pending') as GrantStatus,
      }
    };
  } catch (error) {
    console.error('Grant application failed:', error);
    return { success: false, error: 'Network error' };
  }
};

export const getUserGrants = async (address?: string): Promise<GrantApplication[]> => {
  try {
    const response = await fetch(`${API_BASE}/grants/my-grants`, {
      credentials: 'include',
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    
    return (data || []).map((g: any) => ({
      id: g.id,
      projectName: g.project_name,
      teamDetails: g.team_details,
      projectDescription: g.project_description,
      fundingAmount: g.funding_amount,
      applicantAddress: g.applicant_address,
      status: g.status as GrantStatus,
    }));
  } catch (error) {
    console.error('Failed to fetch user grants:', error);
    return [];
  }
};

function getMockProposals(): Proposal[] {
  return [
    { 
      id: 'p1', 
      title: 'Fund Development of Aethex Wallet Extension', 
      description: 'This proposal seeks to allocate 50,000 USDC from the treasury to fund a dedicated team for building a browser wallet extension for .aethex domains.',
      proposer: '0xDeveloper.eth', 
      status: ProposalStatus.Active, 
      votes: { for: 12500, against: 1200, abstain: 300 }, 
      endDate: Date.now() + 604800000 
    },
    { 
      id: 'p2', 
      title: 'Integrate .aethex with Solana Name Service', 
      description: 'Proposal to build a bridge for two-way integration with the Solana Name Service, allowing .aethex domains to resolve SOL addresses.',
      proposer: '0xSolanaFan.eth', 
      status: ProposalStatus.Passed, 
      votes: { for: 25000, against: 500, abstain: 100 }, 
      endDate: Date.now() - 604800000 
    },
    { 
      id: 'p3', 
      title: 'Lower registration fees for 6+ character domains', 
      description: 'This proposal suggests reducing the annual registration fee for domains with 6 or more characters from 0.01 ETH to 0.005 ETH to encourage wider adoption.',
      proposer: '0xCommunityMember.eth', 
      status: ProposalStatus.Defeated, 
      votes: { for: 8000, against: 15000, abstain: 2000 }, 
      endDate: Date.now() - 1209600000 
    },
  ];
}

export const getUserDomains = async (address: string): Promise<Domain[]> => {
  const userDomain = await getUserDomain();
  if (userDomain.domain) {
    return [{
      id: '1',
      name: userDomain.domain,
      owner: userDomain.walletAddress || address,
      expires: Date.now() + 31536000000,
      records: { eth: userDomain.walletAddress || '', btc: '', sol: '', ipfs: '', avatar: '', twitter: '', discord: '' }
    }];
  }
  return [];
};

export const registerDomain = async (name: string, owner: string): Promise<Domain> => {
  const result = await claimDomain(name, owner);
  if (!result.success) {
    throw new Error(result.error || 'Failed to register domain');
  }
  return {
    id: '1',
    name: result.domain || `${name}.aethex`,
    owner,
    expires: Date.now() + 31536000000,
    records: { eth: owner, btc: '', sol: '', ipfs: '', avatar: '', twitter: '', discord: '' }
  };
};

export const updateDomainRecords = async (domainId: string, records: Domain['records']): Promise<Domain> => {
  throw new Error('Domain record updates are handled on-chain');
};

export const renewDomain = async (domainId: string): Promise<Domain> => {
  throw new Error('Domain renewals are handled on-chain');
};

export const getProposalById = async (id: string): Promise<Proposal | undefined> => {
  const proposals = await getProposals();
  return proposals.find(p => p.id === id);
};

export const getPricingConfig = async () => {
  return {
    char2: 1.0,
    char3_4: 0.1,
    char5_plus: 0.01
  };
};

export const updatePricingConfig = async (newConfig: { char2: number; char3_4: number; char5_plus: number }) => {
  return newConfig;
};
