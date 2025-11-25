import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAccount } from "wagmi";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ExternalLink, Plus } from "lucide-react";
import { WalletConnect } from "@/components/WalletConnect";
import { ProposalList } from "@/components/governance/ProposalList";
import { CreateProposal } from "@/components/governance/CreateProposal";
import { VoteModal } from "@/components/governance/VoteModal";
import { ProposalDetails } from "@/components/governance/ProposalDetails";
import { VotingStats } from "@/components/hub/VotingStats";
import { DelegateProfiles } from "@/components/hub/DelegateProfiles";
import { governanceStats, delegateProfiles } from "@/lib/content";

export default function Governance() {
  const { user } = useAuth();
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<bigint | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/hub/governance");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <>
      <SEO
        pageTitle="Governance"
        description="AeThex Foundation on-chain governance - participate in DAO voting and community decision-making."
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-12">
          {/* Header */}
          <section className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4 flex-1">
                <Badge variant="outline" className="border-red-500/50 text-red-500">
                  On-Chain Governance
                </Badge>
                <h1 className="text-4xl font-bold">
                  <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                    DAO Governance
                  </span>
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl">
                  Participate in on-chain governance. Create proposals, vote with AETH tokens, and shape the future of the Foundation.
                </p>
              </div>
              <WalletConnect />
            </div>
          </section>

          {/* Tally Integration Banner */}
          <Card className="p-8 border-red-900/30 bg-gradient-to-br from-red-950/30 via-yellow-950/10 to-black/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-yellow-600 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AeThex DAO on Tally</h2>
                    <p className="text-sm text-gray-400">Full governance dashboard with proposal history</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  View all proposals, voting history, and detailed governance analytics on Tally's professional DAO interface.
                </p>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shrink-0"
                asChild
              >
                <a href="https://www.tally.xyz/gov/aethex" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open on Tally
                </a>
              </Button>
            </div>
          </Card>

          {/* DAO Info */}
          <Card className="p-6 border-red-900/30 bg-gradient-to-br from-red-950/20 to-black/20">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Contract Information
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-500">Network:</span>
                    <span className="text-white font-mono">Ethereum Sepolia</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500">Governor:</span>
                    <a
                      href="https://sepolia.etherscan.io/address/0x6660344dA659aAcA0a7733dd70499be7ffa9F4Fa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400 hover:text-red-300 font-mono text-xs flex items-center gap-1"
                    >
                      0x6660...9F4Fa
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500">Token (AETH):</span>
                    <a
                      href="https://sepolia.etherscan.io/address/0xf846380e25b34B71474543fdB28258F8477E2Cf1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400 hover:text-red-300 font-mono text-xs flex items-center gap-1"
                    >
                      0xf846...2Cf1
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Voting Parameters</div>
                <div className="space-y-1 text-xs">
                  <div className="flex gap-2">
                    <span className="text-gray-500">Voting Delay:</span>
                    <span className="text-white">1 day</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500">Voting Period:</span>
                    <span className="text-white">1 week</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500">Quorum:</span>
                    <span className="text-white">4%</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500">Proposal Threshold:</span>
                    <span className="text-white">1000 AETH</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Wallet Connection Required */}
          {!isConnected && (
            <Card className="p-12 text-center border-red-900/30 bg-red-950/20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
                  <Users className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-400 max-w-md mx-auto mb-6">
                    Connect your Ethereum wallet to view proposals, create new proposals, and vote on active governance decisions.
                  </p>
                  <WalletConnect />
                </div>
              </div>
            </Card>
          )}

          {/* Governance Content (Wallet Connected) */}
          {isConnected && (
            <>
              {selectedProposal ? (
                <ProposalDetails
                  proposalId={selectedProposal}
                  onVote={() => setShowVoteModal(true)}
                  onBack={() => setSelectedProposal(null)}
                />
              ) : showCreateProposal ? (
                <CreateProposal onClose={() => setShowCreateProposal(false)} />
              ) : (
                <Tabs defaultValue="proposals" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <TabsList className="bg-black/30 border border-red-900/30">
                      <TabsTrigger value="proposals">Proposals</TabsTrigger>
                      <TabsTrigger value="create">Create Proposal</TabsTrigger>
                    </TabsList>
                    <Button
                      onClick={() => setShowCreateProposal(true)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Proposal
                    </Button>
                  </div>

                  <TabsContent value="proposals">
                    <ProposalList onSelectProposal={setSelectedProposal} />
                  </TabsContent>

                  <TabsContent value="create">
                    <CreateProposal />
                  </TabsContent>
                </Tabs>
              )}
            </>
          )}

          {/* Voting Stats & Delegates */}
          <div className="grid lg:grid-cols-2 gap-6">
            <VotingStats stats={governanceStats} />
            <DelegateProfiles delegates={delegateProfiles} />
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6 border-red-900/30 bg-gradient-to-r from-red-950/20 to-yellow-950/10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">View on Tally</h3>
                  <p className="text-sm text-gray-400">
                    Full governance dashboard and proposal history
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-900/50 hover:bg-red-950/50"
                  asChild
                >
                  <a
                    href="https://www.tally.xyz/gov/aethex"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Tally
                  </a>
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-red-900/30 bg-gradient-to-r from-red-950/20 to-yellow-950/10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">Verified On-Chain</h3>
                  <p className="text-sm text-gray-400">
                    All contracts verified on Sepolia Etherscan
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-900/50 hover:bg-red-950/50"
                  asChild
                >
                  <a
                    href="https://sepolia.etherscan.io/address/0x6660344dA659aAcA0a7733dd70499be7ffa9F4Fa#code"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Etherscan
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Layout>

      {/* Vote Modal */}
      {showVoteModal && selectedProposal && (
        <VoteModal
          proposalId={selectedProposal}
          onClose={() => setShowVoteModal(false)}
        />
      )}
    </>
  );
}
