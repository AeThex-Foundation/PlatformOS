import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vote, Users, FileText, TrendingUp, ExternalLink, CheckCircle2, XCircle, Clock, BarChart3 } from "lucide-react";

export default function Governance() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/hub/governance");
    }
  }, [user, navigate]);

  const activeProposals = [
    {
      id: "PROP-001",
      title: "Curriculum Expansion: Advanced Game AI",
      description: "Proposal to expand Foundation curriculum with advanced AI course covering behavior trees, pathfinding, and machine learning for NPCs.",
      status: "Active",
      votesFor: 142,
      votesAgainst: 23,
      votesAbstain: 8,
      quorum: 150,
      totalVotes: 173,
      timeLeft: "3 days",
      proposer: "mrpiglr",
      tallyUrl: "https://tally.xyz/gov/aethex-foundation/proposal/1",
    },
    {
      id: "PROP-002",
      title: "New Open Source Tool: Asset Pipeline",
      description: "Fund development of an open-source asset pipeline tool for game developers with Unity and Unreal Engine integration.",
      status: "Active",
      votesFor: 98,
      votesAgainst: 12,
      votesAbstain: 5,
      quorum: 150,
      totalVotes: 115,
      timeLeft: "5 days",
      proposer: "andersongladney",
      tallyUrl: "https://tally.xyz/gov/aethex-foundation/proposal/2",
    },
    {
      id: "PROP-003",
      title: "Community Event: Global Game Jam 2025",
      description: "Approve Foundation sponsorship and organization of Global Game Jam 2025 with workshops, prizes, and mentorship.",
      status: "Active",
      votesFor: 215,
      votesAgainst: 8,
      votesAbstain: 12,
      quorum: 150,
      totalVotes: 235,
      timeLeft: "2 days",
      proposer: "foundation",
      tallyUrl: "https://tally.xyz/gov/aethex-foundation/proposal/3",
    },
  ];

  const pastProposals = [
    {
      id: "PROP-PAST-001",
      title: "Workshop Series: Unity Fundamentals",
      status: "Passed",
      votesFor: 189,
      votesAgainst: 15,
      tallyUrl: "https://tally.xyz/gov/aethex-foundation/proposal/0",
    },
    {
      id: "PROP-PAST-002",
      title: "Resource Library Expansion",
      status: "Passed",
      votesFor: 203,
      votesAgainst: 12,
      tallyUrl: "https://tally.xyz/gov/aethex-foundation/proposal/4",
    },
  ];

  const governanceStats = [
    { label: "Total Proposals", value: "127", icon: FileText },
    { label: "Active Voters", value: "482", icon: Users },
    { label: "Proposals Passed", value: "89", icon: TrendingUp },
  ];

  if (!user) {
    return null;
  }

  return (
    <>
      <SEO
        pageTitle="Governance"
        description="AeThex Foundation governance - participate in DAO voting and community decision-making."
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-12">
          <section className="space-y-4">
            <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
              Governance
            </Badge>
            <h1 className="text-4xl font-bold">
              <span className="text-gradient bg-gradient-to-r from-aethex-500 to-gold-500 bg-clip-text text-transparent">
                Community Governance
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Shape the future of the Foundation through democratic decision-making and community proposals.
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-6">
            {governanceStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-border/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-5 w-5 text-aethex-400" />
                      <p className="text-3xl font-bold text-aethex-400">{stat.value}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <Tabs defaultValue="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="active">Active Proposals</TabsTrigger>
                <TabsTrigger value="past">Past Proposals</TabsTrigger>
              </TabsList>
              <Button className="bg-gradient-to-r from-aethex-500 to-gold-500">
                Submit Proposal
              </Button>
            </div>

            <TabsContent value="active" className="space-y-6">
              {activeProposals.map((proposal) => {
                const forPercentage = (proposal.votesFor / proposal.totalVotes) * 100;
                const againstPercentage = (proposal.votesAgainst / proposal.totalVotes) * 100;
                const quorumPercentage = (proposal.totalVotes / proposal.quorum) * 100;
                const hasQuorum = proposal.totalVotes >= proposal.quorum;

                return (
                  <Card key={proposal.id} className="border-border/30 hover:border-aethex-400/50 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="outline" className="border-gold-400/30 text-gold-400">
                              {proposal.id}
                            </Badge>
                            <Badge className="bg-green-500/10 text-green-400 border-green-400/30">
                              <Clock className="h-3 w-3 mr-1" />
                              {proposal.timeLeft} left
                            </Badge>
                            {hasQuorum ? (
                              <Badge className="bg-blue-500/10 text-blue-400 border-blue-400/30">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Quorum Reached
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-amber-400/30 text-amber-400">
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Needs {proposal.quorum - proposal.totalVotes} more votes
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl">{proposal.title}</CardTitle>
                          <CardDescription>{proposal.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Voting Stats */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">For / Against</span>
                          <span className="font-semibold">{proposal.totalVotes} total votes</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-green-400">For: {proposal.votesFor}</span>
                                <span className="text-muted-foreground">{forPercentage.toFixed(1)}%</span>
                              </div>
                              <Progress value={forPercentage} className="h-2 bg-muted [&>div]:bg-green-500" />
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-red-400">Against: {proposal.votesAgainst}</span>
                                <span className="text-muted-foreground">{againstPercentage.toFixed(1)}%</span>
                              </div>
                              <Progress value={againstPercentage} className="h-2 bg-muted [&>div]:bg-red-500" />
                            </div>
                          </div>
                          {proposal.votesAbstain > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Abstain: {proposal.votesAbstain}
                            </div>
                          )}
                        </div>
                        <div className="pt-2 border-t border-border/30">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Quorum Progress</span>
                            <span className="text-muted-foreground">{proposal.totalVotes} / {proposal.quorum}</span>
                          </div>
                          <Progress 
                            value={quorumPercentage} 
                            className={`h-2 bg-muted ${hasQuorum ? '[&>div]:bg-blue-500' : '[&>div]:bg-amber-500'}`} 
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/30">
                        <div className="text-sm text-muted-foreground">
                          Proposed by @{proposal.proposer}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Vote For
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500/50">
                            <XCircle className="h-4 w-4 mr-2" />
                            Vote Against
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-aethex-500/50"
                            asChild
                          >
                            <a href={proposal.tallyUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Tally
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastProposals.map((proposal) => (
                <Card key={proposal.id} className="border-border/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-green-400/30 text-green-400">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {proposal.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span className="text-green-400">{proposal.votesFor} For</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-400" />
                          <span className="text-red-400">{proposal.votesAgainst} Against</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        asChild
                      >
                        <a href={proposal.tallyUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <section className="bg-gradient-to-r from-aethex-500/10 to-gold-500/10 rounded-xl p-8 border border-aethex-400/20">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-aethex-400" />
                DAO Integration
              </h2>
              <p className="text-muted-foreground">
                The Foundation uses Tally.xyz for transparent, on-chain governance. All proposals, votes, and decisions are publicly recorded and verifiable.
              </p>
              <Button
                variant="outline"
                className="border-aethex-400/50 hover:border-aethex-400"
                asChild
              >
                <a href="https://tally.xyz" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Tally
                </a>
              </Button>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
