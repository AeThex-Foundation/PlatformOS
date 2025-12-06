import { useState, useEffect, useMemo } from 'react';
import { Proposal, ProposalStatus } from '@/types/tld';
import { getProposals, getTreasuryBalance } from '@/services/tld-api';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/Layout';

const getStatusColor = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.Active: return 'text-blue-400 border-blue-400';
    case ProposalStatus.Passed: return 'text-green-400 border-green-400';
    case ProposalStatus.Defeated: return 'text-red-400 border-red-400';
    default: return 'text-gray-400 border-gray-400';
  }
};

const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
  return (
    <Link to={`/tld/agora/proposal/${proposal.id}`} className="block hover:-translate-y-1 transition-transform duration-200">
      <Card className="bg-slate-900 border-slate-800 hover:border-red-500/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white">{proposal.title}</h3>
            <span className={`text-xs font-semibold px-2 py-1 border rounded-full ${getStatusColor(proposal.status)}`}>
              {proposal.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-400 truncate">{proposal.description}</p>
          <div className="mt-4 pt-4 border-t border-red-500/20 flex justify-between items-center text-sm">
            <div className="text-gray-400">
              <p>For: <span className="text-green-400 font-mono">{proposal.votes.for.toLocaleString()}</span></p>
              <p>Against: <span className="text-red-400 font-mono">{proposal.votes.against.toLocaleString()}</span></p>
            </div>
            <p className="text-xs text-gray-500">Ends: {new Date(proposal.endDate).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function AgoraPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProposalStatus | 'All'>('All');
  const [treasury, setTreasury] = useState<{ balance: number; currency: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [proposalsData, treasuryData] = await Promise.all([getProposals(), getTreasuryBalance()]);
      setProposals(proposalsData);
      setTreasury(treasuryData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredProposals = useMemo(() => {
    if (activeTab === 'All') return proposals;
    return proposals.filter(p => p.status === activeTab);
  }, [activeTab, proposals]);

  const TabButton = ({ status }: { status: ProposalStatus | 'All' }) => (
    <button
      onClick={() => setActiveTab(status)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === status 
          ? 'bg-red-500 text-white' 
          : 'text-gray-400 hover:bg-slate-800'
      }`}
    >
      {status}
    </button>
  );

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-12 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-white">The Agora</h1>
          {treasury && (
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-400">Treasury Balance</p>
                <p className="text-2xl font-bold text-white">{treasury.balance.toLocaleString()} {treasury.currency}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mb-8 bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">How Governance Works</h2>
            <div className="grid md:grid-cols-3 gap-6 text-gray-400 text-sm">
              <div>
                <h3 className="font-bold text-amber-400 mb-1">1. Propose</h3>
                <p>Any community member can draft a proposal to improve the Aethex ecosystem. Proposals can range from technical upgrades to treasury spending.</p>
              </div>
              <div>
                <h3 className="font-bold text-amber-400 mb-1">2. Vote</h3>
                <p>Every .aethex domain holder has voting power. The longer you've held your domain, the more your vote counts. Voting is done on-chain and is transparent.</p>
              </div>
              <div>
                <h3 className="font-bold text-amber-400 mb-1">3. Execute</h3>
                <p>If a proposal passes the voting threshold and has more 'For' votes than 'Against', it is automatically executed by the DAO's smart contracts.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2 bg-slate-950 p-1 rounded-lg">
            <TabButton status="All" />
            <TabButton status={ProposalStatus.Active} />
            <TabButton status={ProposalStatus.Passed} />
            <TabButton status={ProposalStatus.Defeated} />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <div className="mt-4 pt-4 border-t border-red-500/20 flex justify-between items-center">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProposals.map(p => <ProposalCard key={p.id} proposal={p} />)}
          </div>
        )}

        <Card className="mt-12 bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Roadmap</h2>
            <div className="relative border-l-2 border-red-500/50 ml-4 md:ml-0 md:border-l-0 md:border-t-2 md:w-3/4 md:mx-auto">
              <div className="mb-8 flex md:block">
                <div className="flex-shrink-0 md:absolute md:top-0 md:left-1/4 md:-mt-3">
                  <div className="w-6 h-6 rounded-full bg-red-500 ring-4 ring-slate-950"></div>
                </div>
                <div className="ml-6 md:ml-0 md:mt-6 md:w-full md:text-center">
                  <h3 className="text-lg font-bold text-amber-400">Q3 2024: Wallet Extension</h3>
                  <p className="text-gray-400">Launch of the official Aethex browser extension for seamless domain management and integration.</p>
                </div>
              </div>
              <div className="mb-8 flex md:block">
                <div className="flex-shrink-0 md:absolute md:top-0 md:left-2/4 md:-mt-3">
                  <div className="w-6 h-6 rounded-full bg-red-500 ring-4 ring-slate-950"></div>
                </div>
                <div className="ml-6 md:ml-0 md:mt-6 md:w-full md:text-center">
                  <h3 className="text-lg font-bold text-amber-400">Q4 2024: L2 Integration</h3>
                  <p className="text-gray-400">Deploy on a major L2 solution to drastically reduce registration and management fees.</p>
                </div>
              </div>
              <div className="flex md:block">
                <div className="flex-shrink-0 md:absolute md:top-0 md:left-3/4 md:-mt-3">
                  <div className="w-6 h-6 rounded-full bg-red-500 ring-4 ring-slate-950"></div>
                </div>
                <div className="ml-6 md:ml-0 md:mt-6 md:w-full md:text-center">
                  <h3 className="text-lg font-bold text-amber-400">Q1 2025: Subdomain Marketplace</h3>
                  <p className="text-gray-400">Enable .aethex domain owners to create, manage, and sell their own subdomains.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
