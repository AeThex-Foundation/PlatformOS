import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vote, Users, FileText, TrendingUp, ExternalLink } from "lucide-react";

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
      status: "Active",
      votes: 142,
      timeLeft: "3 days",
    },
    {
      id: "PROP-002",
      title: "New Open Source Tool: Asset Pipeline",
      status: "Active",
      votes: 98,
      timeLeft: "5 days",
    },
    {
      id: "PROP-003",
      title: "Community Event: Global Game Jam 2025",
      status: "Active",
      votes: 215,
      timeLeft: "2 days",
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

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Active Proposals</h2>
              <Button className="bg-gradient-to-r from-aethex-500 to-gold-500">
                Submit Proposal
              </Button>
            </div>
            <div className="space-y-4">
              {activeProposals.map((proposal) => (
                <Card key={proposal.id} className="border-border/30 hover:border-aethex-400/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-gold-400/30 text-gold-400">
                            {proposal.id}
                          </Badge>
                          <Badge variant="secondary">{proposal.status}</Badge>
                        </div>
                        <CardTitle className="text-xl">{proposal.title}</CardTitle>
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground hover:text-aethex-400 transition-colors cursor-pointer" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Vote className="h-4 w-4 text-aethex-400" />
                        <span className="text-sm font-semibold">{proposal.votes} votes</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {proposal.timeLeft} remaining
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Vote Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

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
