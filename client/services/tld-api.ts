import { Domain, Proposal, ProposalStatus, GrantApplication, GrantStatus } from '@/types/tld';

let domains: Domain[] = [
  { id: '1', name: 'jane.aethex', owner: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', expires: Date.now() + (5 * 24 * 60 * 60 * 1000), records: { eth: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', btc: 'bc1q...', sol: 'SoL...', ipfs: 'ipfs://...', avatar: 'https://picsum.photos/id/237/200', twitter: '@jane', discord: 'jane#1234' } },
  { id: '2', name: 'dao.aethex', owner: '0xDAO...', expires: Date.now() + 31536000000, records: { eth: '0xDAO...', btc: '', sol: '', ipfs: '', avatar: '', twitter: '', discord: '' } },
];

let proposals: Proposal[] = [
  { id: 'p1', title: 'Fund Development of Aethex Wallet Extension', description: 'This proposal seeks to allocate 50,000 USDC from the treasury to fund a dedicated team for building a browser wallet extension for .aethex domains.', proposer: '0xDeveloper.eth', status: ProposalStatus.Active, votes: { for: 12500, against: 1200, abstain: 300 }, endDate: Date.now() + 604800000 },
  { id: 'p2', title: 'Integrate .aethex with Solana Name Service', description: 'Proposal to build a bridge for two-way integration with the Solana Name Service, allowing .aethex domains to resolve SOL addresses.', proposer: '0xSolanaFan.eth', status: ProposalStatus.Passed, votes: { for: 25000, against: 500, abstain: 100 }, endDate: Date.now() - 604800000 },
  { id: 'p3', title: 'Lower registration fees for 6+ character domains', description: 'This proposal suggests reducing the annual registration fee for domains with 6 or more characters from 0.01 ETH to 0.005 ETH to encourage wider adoption.', proposer: '0xCommunityMember.eth', status: ProposalStatus.Defeated, votes: { for: 8000, against: 15000, abstain: 2000 }, endDate: Date.now() - 1209600000 },
];

let grants: GrantApplication[] = [
  { id: 'g1', projectName: 'Aethex Mobile Manager', teamDetails: 'Lead by @mobiledev', projectDescription: 'A native iOS and Android app for managing .aethex domains.', fundingAmount: 25000, applicantAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', status: GrantStatus.UnderReview },
];

let pricingConfig = {
  char2: 1.0,
  char3_4: 0.1,
  char5_plus: 0.01
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const checkDomainAvailability = async (name: string): Promise<{ available: boolean; price?: number }> => {
  await delay(500);
  const domainName = name.toLowerCase().endsWith('.aethex') ? name.toLowerCase() : `${name.toLowerCase()}.aethex`;
  const exists = domains.some(d => d.name === domainName);
  if (exists) {
    return { available: false };
  }
  const nameOnly = domainName.replace('.aethex', '');
  
  let price = pricingConfig.char5_plus;
  if (nameOnly.length <= 2) price = pricingConfig.char2;
  else if (nameOnly.length <= 4) price = pricingConfig.char3_4;
  
  return { available: true, price };
};

export const registerDomain = async (name: string, owner: string): Promise<Domain> => {
  await delay(1500);
  const domainName = `${name.toLowerCase()}.aethex`;
  const newDomain: Domain = {
    id: (Math.random() * 1000).toString(),
    name: domainName,
    owner,
    expires: Date.now() + 31536000000,
    records: { eth: owner, btc: '', sol: '', ipfs: '', avatar: '', twitter: '', discord: '' }
  };
  domains.push(newDomain);
  return newDomain;
};

export const getUserDomains = async (address: string): Promise<Domain[]> => {
  await delay(800);
  return domains.filter(d => d.owner.toLowerCase() === address.toLowerCase());
};

export const updateDomainRecords = async (domainId: string, records: Domain['records']): Promise<Domain> => {
  await delay(1000);
  const domainIndex = domains.findIndex(d => d.id === domainId);
  if (domainIndex === -1) throw new Error('Domain not found');
  domains[domainIndex].records = records;
  return domains[domainIndex];
};

export const renewDomain = async (domainId: string): Promise<Domain> => {
  await delay(1500);
  const domainIndex = domains.findIndex(d => d.id === domainId);
  if (domainIndex === -1) throw new Error('Domain not found');
  
  const ONE_YEAR_MS = 31536000000;
  const currentExpiry = domains[domainIndex].expires;
  const newExpiry = (currentExpiry < Date.now() ? Date.now() : currentExpiry) + ONE_YEAR_MS;
  
  domains[domainIndex].expires = newExpiry;
  return domains[domainIndex];
};

export const getProposals = async (): Promise<Proposal[]> => {
  await delay(700);
  return [...proposals].sort((a, b) => b.endDate - a.endDate);
};

export const getProposalById = async (id: string): Promise<Proposal | undefined> => {
  await delay(400);
  return proposals.find(p => p.id === id);
}

export const submitVote = async (proposalId: string, vote: 'for' | 'against' | 'abstain', power: number): Promise<Proposal> => {
  await delay(1200);
  const proposal = proposals.find(p => p.id === proposalId);
  if (!proposal) throw new Error('Proposal not found');
  proposal.votes[vote] += power;
  return proposal;
};

export const submitGrantApplication = async (app: Omit<GrantApplication, 'id' | 'status'>): Promise<GrantApplication> => {
  await delay(1500);
  const newGrant: GrantApplication = {
    ...app,
    id: `g${grants.length + 1}`,
    status: GrantStatus.UnderReview,
  };
  grants.push(newGrant);
  return newGrant;
};

export const getUserGrants = async (address: string): Promise<GrantApplication[]> => {
  await delay(600);
  return grants.filter(g => g.applicantAddress.toLowerCase() === address.toLowerCase());
};

export const getTreasuryBalance = async (): Promise<{ balance: number; currency: string }> => {
  await delay(300);
  return { balance: 1_250_450, currency: 'USDC' };
}

export const getPricingConfig = async () => {
  await delay(300);
  return { ...pricingConfig };
};

export const updatePricingConfig = async (newConfig: typeof pricingConfig) => {
  await delay(800);
  pricingConfig = { ...newConfig };
  return pricingConfig;
};
