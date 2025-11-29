import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Vote,
  Users,
  Code,
  Award,
  ArrowRight,
  Sparkles,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Hub() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/hub");
    }
  }, [user, navigate]);

  const hubSections = [
    {
      title: "Protocol",
      description: "Technical documentation, whitepaper, and architecture guides",
      icon: BookOpen,
      color: "from-aethex-500 to-red-600",
      link: "/hub/protocol",
      badge: "Docs",
    },
    {
      title: "Governance",
      description: "DAO voting, proposals, and community decision-making",
      icon: Vote,
      color: "from-red-500 to-gold-500",
      link: "/hub/governance",
      badge: "DAO",
    },
    {
      title: "Community",
      description: "Bounty board, collaboration, and project opportunities",
      icon: Users,
      color: "from-gold-500 to-amber-500",
      link: "/hub/community",
      badge: "Active",
    },
    {
      title: "Programs",
      description: "Foundation programs, mentorship, and learning paths",
      icon: Award,
      color: "from-amber-500 to-aethex-600",
      link: "/curriculum",
      badge: "Learn",
    },
    {
      title: "Passport",
      description: "Claim your .aethex domain - your on-chain identity",
      icon: Shield,
      color: "from-purple-500 to-pink-500",
      link: "/hub/passport",
      badge: "Identity",
    },
  ];

  const quickActions = [
    {
      title: "Browse Bounties",
      link: "/hub/community",
      icon: Code,
    },
    {
      title: "Submit Proposal",
      link: "/hub/governance",
      icon: Vote,
    },
    {
      title: "Read Docs",
      link: "/hub/protocol",
      icon: BookOpen,
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <>
      <SEO
        pageTitle="Hub"
        description="AeThex Foundation Community Hub - Access protocol docs, governance, and community collaboration."
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="border-aethex-400/50 text-aethex-400 mb-4">
                  Community Hub
                </Badge>
                <h1 className="text-4xl font-bold">
                  Welcome Back, <span className="text-aethex-400">{user.email?.split('@')[0]}</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Access Foundation resources, contribute to governance, and collaborate with the community.
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-gold-400" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Hub Sections</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hubSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Link key={index} to={section.link}>
                    <Card className="border-border/30 hover:border-aethex-400/50 transition-all group cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${section.color} grid place-items-center`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <Badge variant="outline" className="border-aethex-400/30">
                            {section.badge}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                        <div className="flex items-center text-aethex-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                          Explore <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    asChild
                    variant="outline"
                    className="h-auto py-6 border-border/30 hover:border-aethex-400/50"
                  >
                    <Link to={action.link} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-aethex-400" />
                      <span>{action.title}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </section>

          <section className="bg-gradient-to-r from-aethex-500/10 to-red-500/10 rounded-xl p-8 border border-aethex-400/20">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Community Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-3xl font-bold text-aethex-400">42</p>
                  <p className="text-sm text-muted-foreground">Active Bounties</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-aethex-400">128</p>
                  <p className="text-sm text-muted-foreground">Contributors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-aethex-400">15</p>
                  <p className="text-sm text-muted-foreground">Active Proposals</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-aethex-400">25+</p>
                  <p className="text-sm text-muted-foreground">Open Source Tools</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
