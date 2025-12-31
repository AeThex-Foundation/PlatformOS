import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  FileText,
  AlertCircle,
  Scale,
  Eye,
  Lock,
  Heart,
  ExternalLink,
  Vote,
  Landmark,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Trust() {
  const councilMembers = [
    {
      name: "Council Member 1",
      role: "Lead Ethics Advisor",
      bio: "Oversees ethical guidelines and community standards",
      expertise: "Community Governance",
    },
    {
      name: "Council Member 2",
      role: "Technical Standards",
      bio: "Ensures technical integrity and open source compliance",
      expertise: "Open Source Policy",
    },
    {
      name: "Council Member 3",
      role: "Identity Standards",
      bio: "Maintains authentication policy and identity infrastructure integrity",
      expertise: "Identity Governance & Standards",
    },
  ];

  const responsibilities = [
    {
      title: "Community Standards",
      description: "Establishing and maintaining codes of conduct and ethical guidelines",
      icon: Users,
    },
    {
      title: "Transparency",
      description: "Ensuring open governance and public decision-making processes",
      icon: FileText,
    },
    {
      title: "Conflict Resolution",
      description: "Addressing disputes and maintaining community trust",
      icon: Shield,
    },
    {
      title: "Policy Review",
      description: "Regular review and updates to foundation policies",
      icon: AlertCircle,
    },
  ];

  const principles = [
    {
      title: "Open Governance",
      description: "All major decisions are made transparently with community input through our DAO.",
      icon: Vote,
    },
    {
      title: "Identity Sovereignty",
      description: "Users control their own digital identity. The Foundation governs policy, not data.",
      icon: Lock,
    },
    {
      title: "Enforcement Authority",
      description: "The Foundation can revoke access to Passport for properties that violate trust standards.",
      icon: Shield,
    },
    {
      title: "Equal Access",
      description: "Authentication and identity services are available to all ecosystem participants.",
      icon: Scale,
    },
    {
      title: "Accountability",
      description: "Leadership is accountable to the community through on-chain governance.",
      icon: Eye,
    },
    {
      title: "Community Driven",
      description: "The Foundation exists to serve its community, not the other way around.",
      icon: Heart,
    },
    {
      title: "Decentralized Control",
      description: "Power is distributed across the community through token-based governance.",
      icon: Landmark,
    },
  ];

  return (
    <>
      <SEO
        pageTitle="Trust & Governance"
        description="Learn about the AeThex Foundation's commitment to transparency, ethics, and community-driven governance."
      />
      <Layout>
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden pb-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-aethex-900/30 via-background to-gold-900/20" />
          <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-aethex-500/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />

          <main className="relative z-10">
            <section className="py-16">
              <div className="container mx-auto px-4 max-w-6xl text-center space-y-6">
                <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
                  Governance
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-bold">
                  <span className="text-gradient bg-gradient-to-r from-aethex-500 via-red-500 to-gold-500 bg-clip-text text-transparent">
                    Trust & Governance
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  The Foundation operates with transparency, accountability, and community-driven decision making at its core.
                </p>
              </div>
            </section>

            <section className="py-12 border-y border-border/30 bg-card/30">
              <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Our Principles</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    These core principles guide every decision we make.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {principles.map((principle, index) => {
                    const Icon = principle.icon;
                    return (
                      <Card key={index} className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-aethex-400/50 transition-all">
                        <CardContent className="pt-6 space-y-3">
                          <div className="w-12 h-12 rounded-lg bg-aethex-500/10 grid place-items-center">
                            <Icon className="h-6 w-6 text-aethex-400" />
                          </div>
                          <h3 className="font-semibold text-lg">{principle.title}</h3>
                          <p className="text-sm text-muted-foreground">{principle.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="py-16">
              <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <Badge variant="outline" className="border-gold-400/50 text-gold-400">
                      On-Chain Governance
                    </Badge>
                    <h2 className="text-3xl font-bold">AeThex DAO</h2>
                    <p className="text-muted-foreground">
                      The Foundation is governed by a decentralized autonomous organization (DAO) powered by the $AETHEX token. Token holders can propose and vote on Foundation decisions, ensuring true community ownership.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-aethex-500/10 grid place-items-center">
                          <Vote className="h-5 w-5 text-aethex-400" />
                        </div>
                        <div>
                          <p className="font-medium">1-Week Voting Period</p>
                          <p className="text-sm text-muted-foreground">Ample time for community discussion</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold-500/10 grid place-items-center">
                          <Scale className="h-5 w-5 text-gold-400" />
                        </div>
                        <div>
                          <p className="font-medium">4% Quorum Requirement</p>
                          <p className="text-sm text-muted-foreground">Ensures meaningful participation</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 grid place-items-center">
                          <Lock className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium">2-Day Timelock</p>
                          <p className="text-sm text-muted-foreground">Safety period before execution</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button asChild className="bg-gradient-to-r from-aethex-500 to-red-600">
                        <Link to="/hub/governance">
                          View Governance
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="border-aethex-400/30">
                        <a href="https://www.tally.xyz/gov/aethex-collective" target="_blank" rel="noopener noreferrer">
                          Tally Dashboard
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  <Card className="bg-card/60 border-border/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Landmark className="h-5 w-5 text-gold-400" />
                        Governance Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 rounded-lg bg-card/60 border border-border/30">
                          <p className="text-3xl font-bold text-aethex-400">1M</p>
                          <p className="text-sm text-muted-foreground">$AETHEX Supply</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-card/60 border border-border/30">
                          <p className="text-3xl font-bold text-gold-400">40K</p>
                          <p className="text-sm text-muted-foreground">Quorum Tokens</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-card/60 border border-border/30">
                          <p className="text-3xl font-bold text-amber-400">1 Day</p>
                          <p className="text-sm text-muted-foreground">Voting Delay</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-card/60 border border-border/30">
                          <p className="text-3xl font-bold text-red-400">7 Days</p>
                          <p className="text-sm text-muted-foreground">Voting Period</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-aethex-500/10 border border-aethex-500/20">
                        <p className="text-sm text-center text-muted-foreground">
                          Live on <span className="text-aethex-400 font-medium">Polygon Mainnet</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            <section className="py-16 border-t border-border/30">
              <div className="container mx-auto px-4 max-w-6xl space-y-12">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Ethics Council</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Our council is composed of experienced community members committed to maintaining trust and ethical standards.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {councilMembers.map((member, index) => (
                    <Card key={index} className="bg-card/60 border-border/30 hover:border-aethex-400/50 transition-all">
                      <CardHeader>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-aethex-500 to-red-600 grid place-items-center mb-4 mx-auto">
                          <Users className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-center">{member.name}</CardTitle>
                        <Badge variant="outline" className="mx-auto border-aethex-400/30">
                          {member.role}
                        </Badge>
                      </CardHeader>
                      <CardContent className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">{member.bio}</p>
                        <p className="text-xs font-semibold text-aethex-400">{member.expertise}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto px-4 max-w-6xl space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Council Responsibilities</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    The Council's primary responsibilities in ensuring Foundation integrity.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {responsibilities.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Card key={index} className="bg-card/60 backdrop-blur-sm border-border/30 text-center">
                        <CardContent className="pt-6 space-y-3">
                          <div className="w-12 h-12 rounded-lg bg-aethex-500/10 grid place-items-center mx-auto">
                            <Icon className="h-6 w-6 text-aethex-400" />
                          </div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto px-4 max-w-4xl">
                <Card className="bg-gradient-to-r from-aethex-500/10 to-red-500/10 border border-aethex-400/20">
                  <CardContent className="p-8 space-y-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Shield className="h-6 w-6 text-aethex-400" />
                      Report a Concern
                    </h2>
                    <p className="text-muted-foreground">
                      If you have concerns about Foundation policies, community conduct, or ethical matters, the Council is here to listen and take action.
                    </p>
                    <div className="pt-4">
                      <Button asChild className="bg-gradient-to-r from-aethex-500 to-red-600">
                        <Link to="/contact">Contact the Council</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </main>
        </div>
      </Layout>
    </>
  );
}
