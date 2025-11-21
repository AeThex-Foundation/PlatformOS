import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, BookOpen, ArrowRight, Target, Heart, Zap } from "lucide-react";

export default function FoundationCommunity() {
  const communityFeatures = [
    {
      icon: Users,
      title: "Teams",
      description: "Join collaborative teams working on AeThex projects and initiatives.",
      link: "/foundation/community/teams",
      color: "text-red-500",
    },
    {
      icon: BookOpen,
      title: "About the Community",
      description: "Learn about our vibrant community of creators, developers, and innovators.",
      link: "/foundation/community/about",
      color: "text-yellow-500",
    },
    {
      icon: Trophy,
      title: "Leaderboard",
      description: "See top contributors and their achievements in the AeThex ecosystem.",
      link: "/leaderboard",
      color: "text-red-500",
    },
    {
      icon: Target,
      title: "Creator Directory",
      description: "Discover talented creators building the future of gaming and interactive media.",
      link: "/creators",
      color: "text-yellow-500",
    },
  ];

  const engagement = [
    {
      icon: Heart,
      title: "Get Involved",
      description: "Start contributing to the Foundation and make an impact.",
      link: "/foundation/get-involved",
    },
    {
      icon: Zap,
      title: "Community Hub",
      description: "Join the active community hub for real-time collaboration (requires login).",
      link: "/hub/community",
    },
  ];

  return (
    <Layout>
      <SEO 
        pageTitle="Community - AeThex Foundation"
        description="Join the AeThex Foundation community of creators, developers, and innovators building the future of gaming and interactive media."
      />

      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              Foundation Community
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A thriving ecosystem of creators, developers, and innovators collaborating to build the future of gaming and interactive media.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {communityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-background border border-border ${feature.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="mb-2">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full group-hover:bg-red-500/10 group-hover:border-red-500/50">
                      <Link to={feature.link} className="flex items-center justify-center gap-2">
                        Explore
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-red-500/10 via-yellow-500/5 to-red-500/10 rounded-xl p-8 border border-red-500/20">
            <h2 className="text-3xl font-bold mb-8 text-center">Get Engaged</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {engagement.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-5 w-5 text-red-500" />
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full bg-red-500 hover:bg-red-600">
                        <Link to={item.link}>
                          Learn More
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
