import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  BookOpen,
  Users,
  Trophy,
  FileText,
  Vote,
  MessageSquare,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Calendar,
  ExternalLink,
} from "lucide-react";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const quickLinks = [
    { name: "Protocol Docs", href: "/hub/protocol", icon: BookOpen, description: "Technical documentation" },
    { name: "Governance", href: "/hub/governance", icon: Vote, description: "DAO proposals & voting" },
    { name: "Community Board", href: "/hub/community", icon: Users, description: "Bounties & collaboration" },
    { name: "Curriculum", href: "/foundation/curriculum", icon: Shield, description: "Learning resources" },
    { name: "Achievements", href: "/foundation/achievements", icon: Trophy, description: "Your badges" },
    { name: "Downloads", href: "/foundation/downloads", icon: FileText, description: "Tools & resources" },
  ];

  const communityActivity = [
    {
      id: 1,
      type: "bounty",
      title: "Build DeFi Analytics Dashboard",
      author: "Foundation Council",
      timestamp: "2 hours ago",
      category: "Development",
      reward: "500 $AETHEX",
      participants: 12,
    },
    {
      id: 2,
      type: "proposal",
      title: "Governance Proposal: Community Grant Program Q1 2026",
      author: "Ethics Council",
      timestamp: "5 hours ago",
      category: "Governance",
      votes: 847,
      status: "Active",
    },
    {
      id: 3,
      type: "discussion",
      title: "Best practices for game monetization in Web3",
      author: "Guardian @cryptodev",
      timestamp: "1 day ago",
      category: "Discussion",
      replies: 23,
    },
    {
      id: 4,
      type: "bounty",
      title: "Write tutorial: Building smart contracts with Solidity",
      author: "Foundation Council",
      timestamp: "2 days ago",
      category: "Content",
      reward: "250 $AETHEX",
      participants: 5,
    },
    {
      id: 5,
      type: "announcement",
      title: "AeThex Foundation Monthly Community Call - January 2026",
      author: "Foundation Team",
      timestamp: "3 days ago",
      category: "Event",
      attendees: 234,
    },
  ];

  const upcomingEvents = [
    {
      title: "Weekly Developer Standup",
      date: "Tomorrow, 2:00 PM UTC",
      type: "Virtual Meeting",
    },
    {
      title: "Q1 2026 Governance Vote",
      date: "Jan 25, 2026",
      type: "Voting Period",
    },
    {
      title: "Foundation Community AMA",
      date: "Feb 1, 2026",
      type: "Live Event",
    },
  ];

  return (
    <>
      <SEO
        pageTitle="Dashboard - Guardian's Hub"
        description="Your Gateway to the AeThex Foundation"
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-aethex-950/10">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Welcome Header */}
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-amber-400 to-red-500 bg-clip-text text-transparent">
                    {getGreeting()}, {profile?.full_name || profile?.username || "Guardian"}
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Welcome to your Foundation Hub
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10">
                    <Shield className="h-3 w-3 mr-1" />
                    Guardian
                  </Badge>
                </div>
              </div>
              <Separator className="bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content Area - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Links */}
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-400" />
                      Quick Access
                    </CardTitle>
                    <CardDescription>Navigate to key Foundation areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {quickLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          className="group flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-200"
                        >
                          <div className="p-2 rounded-md bg-gradient-to-br from-red-500/20 to-amber-500/20 group-hover:from-red-500/30 group-hover:to-amber-500/30 transition-colors">
                            <link.icon className="h-4 w-4 text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm group-hover:text-red-400 transition-colors">
                              {link.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {link.description}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Community Activity Feed */}
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-red-400" />
                      Community Activity
                    </CardTitle>
                    <CardDescription>Recent updates from the Foundation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {communityActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="group p-4 rounded-lg border border-border/50 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 border-2 border-red-500/30">
                              <AvatarFallback className="bg-gradient-to-br from-red-500/20 to-amber-500/20">
                                <Shield className="h-5 w-5 text-red-400" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400 bg-amber-500/10">
                                  {activity.category}
                                </Badge>
                                {activity.type === "bounty" && activity.reward && (
                                  <Badge variant="outline" className="text-xs border-green-500/50 text-green-400 bg-green-500/10">
                                    {activity.reward}
                                  </Badge>
                                )}
                                {activity.type === "proposal" && activity.status && (
                                  <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400 bg-blue-500/10">
                                    {activity.status}
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-medium text-sm mb-1 group-hover:text-red-400 transition-colors">
                                {activity.title}
                              </h3>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{activity.author}</span>
                                <span>•</span>
                                <span>{activity.timestamp}</span>
                                {activity.participants && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {activity.participants} participants
                                    </span>
                                  </>
                                )}
                                {activity.votes && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Vote className="h-3 w-3" />
                                      {activity.votes} votes
                                    </span>
                                  </>
                                )}
                                {activity.replies && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <MessageSquare className="h-3 w-3" />
                                      {activity.replies} replies
                                    </span>
                                  </>
                                )}
                                {activity.attendees && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {activity.attendees} attendees
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <Button asChild variant="outline" className="w-full border-red-500/50 hover:bg-red-500/10">
                        <Link to="/hub/community">
                          View All Activity
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - 1 column */}
              <div className="space-y-6">
                {/* Upcoming Events */}
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-amber-400" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingEvents.map((event, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg border border-border/50 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-200"
                        >
                          <p className="font-medium text-sm mb-1">{event.title}</p>
                          <p className="text-xs text-muted-foreground mb-1">{event.date}</p>
                          <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400 bg-amber-500/10">
                            {event.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Card */}
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="h-5 w-5 text-red-400" />
                      Your Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Bounties Completed</span>
                        <span className="font-bold text-lg text-red-400">0</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Proposals Voted</span>
                        <span className="font-bold text-lg text-amber-400">0</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Achievements</span>
                        <span className="font-bold text-lg text-red-400">0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Resources */}
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ExternalLink className="h-5 w-5 text-red-400" />
                      Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start border-border/50 hover:border-red-500/50 hover:bg-red-500/5">
                      <Link to="/about">
                        <Shield className="h-4 w-4 mr-2" />
                        About Foundation
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start border-border/50 hover:border-red-500/50 hover:bg-red-500/5">
                      <Link to="/ethics-council">
                        <Users className="h-4 w-4 mr-2" />
                        Ethics Council
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start border-border/50 hover:border-red-500/50 hover:bg-red-500/5">
                      <Link to="/contact">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Us
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
