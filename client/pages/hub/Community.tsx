import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Code, DollarSign, Clock, Users, Star, ArrowRight, Target, Trophy, Zap, GitFork, MessageSquare } from "lucide-react";

export default function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/hub/community");
    }
  }, [user, navigate]);

  const bounties = [
    {
      id: "BNT-042",
      title: "Implement WebGL Shader Support",
      description: "Add WebGL shader support to our game engine renderer. This includes fragment shaders, vertex shaders, and post-processing effects.",
      reward: 500,
      xpReward: 1000,
      difficulty: "Advanced",
      skills: ["Rust", "WebGL", "Graphics"],
      applicants: 3,
      timeEstimate: "2-3 weeks",
      postedBy: "foundation",
      project: "Game Engine",
    },
    {
      id: "BNT-041",
      title: "Documentation: Multiplayer Framework",
      description: "Write comprehensive docs for the multiplayer networking library including API reference, tutorials, and code examples.",
      reward: 200,
      xpReward: 500,
      difficulty: "Intermediate",
      skills: ["Technical Writing", "Networking"],
      applicants: 5,
      timeEstimate: "1-2 weeks",
      postedBy: "mrpiglr",
      project: "Multiplayer Framework",
    },
    {
      id: "BNT-040",
      title: "Bug Fix: Asset Pipeline Memory Leak",
      description: "Identify and fix memory leak in asset processing pipeline when handling large texture batches.",
      reward: 300,
      xpReward: 600,
      difficulty: "Intermediate",
      skills: ["Python", "Debugging"],
      applicants: 2,
      timeEstimate: "3-5 days",
      postedBy: "andersongladney",
      project: "Asset Pipeline",
    },
    {
      id: "BNT-039",
      title: "Create Tutorial Series: 2D Platformer",
      description: "Develop a beginner-friendly tutorial series for creating a 2D platformer game from scratch.",
      reward: 400,
      xpReward: 800,
      difficulty: "Beginner",
      skills: ["Unity", "C#", "Teaching"],
      applicants: 8,
      timeEstimate: "2 weeks",
      postedBy: "foundation",
      project: "Education",
    },
  ];

  const communityProjects = [
    {
      name: "Game Engine",
      contributors: 24,
      status: "Active Development",
    },
    {
      name: "Multiplayer Framework",
      contributors: 18,
      status: "Beta Testing",
    },
    {
      name: "Developer CLI",
      contributors: 12,
      status: "Stable",
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <>
      <SEO
        pageTitle="Community"
        description="AeThex Foundation community hub - collaborate on bounties and open source projects."
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-12">
          <section className="space-y-4">
            <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
              Community
            </Badge>
            <h1 className="text-4xl font-bold">
              <span className="text-gradient bg-gradient-to-r from-aethex-500 to-amber-500 bg-clip-text text-transparent">
                Collaboration & Bounties
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Contribute to open source projects, earn rewards, and collaborate with developers worldwide.
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-6">
            <Card className="border-border/30">
              <CardContent className="pt-6">
                <Code className="h-8 w-8 text-aethex-400 mb-3" />
                <p className="text-3xl font-bold mb-1">42</p>
                <p className="text-sm text-muted-foreground">Active Bounties</p>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-gold-400 mb-3" />
                <p className="text-3xl font-bold mb-1">128</p>
                <p className="text-sm text-muted-foreground">Contributors</p>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-6">
                <DollarSign className="h-8 w-8 text-amber-400 mb-3" />
                <p className="text-3xl font-bold mb-1">$24K</p>
                <p className="text-sm text-muted-foreground">Total Rewards</p>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Open Bounties</h2>
              <Button className="bg-gradient-to-r from-aethex-500 to-gold-500">
                Post Bounty
              </Button>
            </div>
            <div className="space-y-4">
              {bounties.map((bounty) => {
                const getDifficultyColor = (difficulty: string) => {
                  switch (difficulty) {
                    case "Beginner": return "bg-green-500/10 text-green-400 border-green-400/30";
                    case "Intermediate": return "bg-blue-500/10 text-blue-400 border-blue-400/30";
                    case "Advanced": return "bg-purple-500/10 text-purple-400 border-purple-400/30";
                    default: return "bg-gray-500/10 text-gray-400 border-gray-400/30";
                  }
                };

                return (
                  <Card key={bounty.id} className="border-border/30 hover:border-aethex-400/50 transition-all group">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="border-aethex-400/30">
                              {bounty.id}
                            </Badge>
                            <Badge variant="outline" className={getDifficultyColor(bounty.difficulty)}>
                              {bounty.difficulty}
                            </Badge>
                            <Badge className="bg-gold-500/10 text-gold-400 border-gold-400/30">
                              <DollarSign className="h-3 w-3 mr-1" />
                              ${bounty.reward}
                            </Badge>
                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-400/30">
                              <Zap className="h-3 w-3 mr-1" />
                              +{bounty.xpReward} XP
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Target className="h-3 w-3 mr-1" />
                              {bounty.project}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">{bounty.title}</CardTitle>
                          <CardDescription>{bounty.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {bounty.skills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-aethex-400" />
                          <span>{bounty.applicants} applicants</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-aethex-400" />
                          <span>{bounty.timeEstimate}</span>
                        </div>
                        <div className="text-xs">
                          Posted by @{bounty.postedBy}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-border/30">
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-aethex-500 to-gold-500 group-hover:translate-x-1 transition-transform flex-1"
                        >
                          Apply for Bounty
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-aethex-500/50">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Discuss
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Active Projects</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {communityProjects.map((project, index) => (
                <Card key={index} className="border-border/30 hover:border-aethex-400/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <Code className="h-8 w-8 text-aethex-400" />
                      <Badge variant="outline" className="border-gold-400/30 text-gold-400">
                        {project.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{project.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {project.contributors} contributors
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
