import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import OAuthConnections from "@/components/settings/OAuthConnections";
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
  Link2,
  Settings,
  LayoutDashboard,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Dashboard() {
  const { user, profile, linkedProviders, linkProvider, unlinkProvider, refreshProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showInDirectory, setShowInDirectory] = useState(profile?.show_in_creator_directory || false);
  const { toast } = useToast();
  
  const activeTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    if (profile) {
      setShowInDirectory(profile.show_in_creator_directory || false);
    }
  }, [profile]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handleDirectoryToggle = async (enabled: boolean) => {
    if (!profile || !user) return;

    // Check if profile is complete (avatar, username, bio required)
    const isProfileComplete = !!(profile.avatar_url && profile.username && profile.bio);
    
    if (enabled && !isProfileComplete) {
      toast({
        title: "Incomplete Profile",
        description: "To appear in the Creator Directory, you need an avatar, username, and bio. Complete your profile first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setShowInDirectory(enabled);

      // Get current session for auth token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        throw new Error('No auth token available');
      }

      const response = await fetch('/api/profile/creator-directory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ show_in_directory: enabled }),
      });

      if (!response.ok) {
        throw new Error('Failed to update directory settings');
      }

      await refreshProfile();

      toast({
        title: enabled ? "You're now visible!" : "Profile hidden",
        description: enabled 
          ? "Your profile will appear in the public Creator Directory."
          : "Your profile has been removed from the public Creator Directory.",
      });
    } catch (error) {
      console.error('Error updating directory settings:', error);
      setShowInDirectory(!enabled); // Revert on error
      toast({
        title: "Error",
        description: "Failed to update directory settings. Please try again.",
        variant: "destructive",
      });
    }
  };

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

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="overview" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="connections" className="gap-2">
                  <Link2 className="h-4 w-4" />
                  Connections
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
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
              </TabsContent>

              {/* Connections Tab */}
              <TabsContent value="connections" className="space-y-6">
                <OAuthConnections
                  providers={[
                    {
                      provider: "discord",
                      name: "Discord",
                      description: "Link your Discord account for community access and role management",
                      Icon: ({ className }: { className?: string }) => (
                        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.317 4.3671a19.8062 19.8062 0 0 0-4.8851-1.5152.074.074 0 0 0-.0784.0371c-.211.3754-.444.8635-.607 1.2491-1.798-.2704-3.5915-.2704-5.3719 0-.163-.3856-.405-.8737-.62-1.2491a.077.077 0 0 0-.0784-.037 19.7363 19.7363 0 0 0-4.888 1.5152.07.07 0 0 0-.0325.0277C1.618 8.443.134 12.4693 1.981 16.4267a.0842.0842 0 0 0 .0313.0355c1.555.8679 3.064 1.3975 4.555 1.7031a.083.083 0 0 0 .09-.0395c.23-.4354.435-.8888.607-1.3518a.083.083 0 0 0-.046-.1159c-.606-.2324-1.184-.5255-1.738-.8614a.084.084 0 0 1-.008-.1404c.117-.0877.234-.1783.346-.2716a.083.083 0 0 1 .088-.0105c3.646 1.6956 7.596 1.6956 11.182 0a.083.083 0 0 1 .088.009c.112.0933.23.1839.347.2717a.083.083 0 0 1-.006.1404c-.557.3359-1.135.6291-1.742.8615a.084.084 0 0 0-.046.1159c.173.4647.377.9189.607 1.3518a.083.083 0 0 0 .09.0395c1.494-.3066 3.003-.8352 4.555-1.7031a.083.083 0 0 0 .035-.0355c2.0037-4.0016.6248-8.0511-2.607-11.3586a.06.06 0 0 0-.031-.0277ZM8.02 13.3328c-.983 0-1.79-.9015-1.79-2.0074 0-1.1059.795-2.0074 1.79-2.0074 1.001 0 1.799.9039 1.79 2.0074 0 1.1059-.795 2.0074-1.79 2.0074Zm7.975 0c-.984 0-1.79-.9015-1.79-2.0074 0-1.1059.795-2.0074 1.79-2.0074.999 0 1.799.9039 1.789 2.0074 0 1.1059-.79 2.0074-1.789 2.0074Z" />
                        </svg>
                      ),
                      gradient: "from-indigo-600 to-purple-600",
                    },
                    {
                      provider: "github",
                      name: "GitHub",
                      description: "Connect your GitHub account for developer verification",
                      Icon: ({ className }: { className?: string }) => (
                        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                      ),
                      gradient: "from-gray-700 to-gray-900",
                    },
                    {
                      provider: "google",
                      name: "Google",
                      description: "Link your Google account for easy sign-in",
                      Icon: ({ className }: { className?: string }) => (
                        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      ),
                      gradient: "from-blue-600 to-red-600",
                    },
                  ]}
                  linkedProviderMap={linkedProviders.reduce((acc, lp) => {
                    acc[lp.provider] = lp;
                    return acc;
                  }, {} as Record<string, typeof linkedProviders[0]>)}
                  connectionAction="link"
                  onLink={linkProvider}
                  onUnlink={unlinkProvider}
                />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                        <div>
                          <p className="font-medium">Full Name</p>
                          <p className="text-sm text-muted-foreground">{profile?.full_name || "Not set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                        <div>
                          <p className="font-medium">Username</p>
                          <p className="text-sm text-muted-foreground">@{profile?.username || "Not set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{user?.email || "Not set"}</p>
                        </div>
                      </div>
                      
                      {/* Creator Directory Opt-In */}
                      <Separator className="my-6" />
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold mb-1">Public Visibility</h3>
                          <p className="text-xs text-muted-foreground">Control how your profile appears to the community</p>
                        </div>
                        <div className="flex items-start justify-between p-4 border border-border/50 rounded-lg bg-card/30">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              {showInDirectory ? (
                                <Eye className="h-4 w-4 text-green-500" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                              <p className="font-medium text-sm">Show in Creator Directory</p>
                              {showInDirectory && (
                                <Badge variant="outline" className="ml-2 text-xs border-green-500/30 text-green-400">
                                  Visible
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Display your profile in the public Foundation Creator Directory.
                              {!profile?.avatar_url || !profile?.username || !profile?.bio ? (
                                <span className="text-amber-500"> Requires: avatar, username, and bio.</span>
                              ) : null}
                            </p>
                            {showInDirectory && (
                              <Link to="/creators" className="text-xs text-blue-400 hover:underline inline-block mt-1">
                                View Creator Directory →
                              </Link>
                            )}
                          </div>
                          <Switch 
                            checked={showInDirectory}
                            onCheckedChange={handleDirectoryToggle}
                            aria-label="Toggle Creator Directory visibility"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button asChild variant="outline" className="w-full border-red-500/50 hover:bg-red-500/10">
                          <Link to="/profile/settings">
                            <Settings className="h-4 w-4 mr-2" />
                            Advanced Settings
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </>
  );
}
