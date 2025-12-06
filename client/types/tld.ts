export interface Domain {
  id: string;
  name: string;
  owner: string;
  expires: number;
  records: {
    eth: string;
    btc: string;
    sol: string;
    ipfs: string;
    avatar: string;
    twitter: string;
    discord: string;
  };
}

export enum ProposalStatus {
  Active = 'Active',
  Passed = 'Passed',
  Defeated = 'Defeated',
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: ProposalStatus;
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  endDate: number;
}

export enum GrantStatus {
  UnderReview = 'Under Review',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface GrantApplication {
  id: string;
  projectName: string;
  teamDetails: string;
  projectDescription: string;
  fundingAmount: number;
  applicantAddress: string;
  status: GrantStatus;
}
