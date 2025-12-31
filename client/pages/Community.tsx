import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Trophy,
  Shield,
  Star,
  Flame,
  Crown,
  ArrowRight,
  Filter,
  Loader2,
  MessageSquare,
  Calendar,
  Zap,
} from "lucide-react";

interface Creator {
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string;
  arms: string[];
  roles: string[];
  is_architect: boolean;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  full_name: string;
  avatar_url: string | null;
  xp: number;
  streak: number;
  badges: number;
}

const ARM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  FOUNDATION: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  GAMEFORGE: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  ETHOS: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  LABS: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
};

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "alex_dev", full_name: "Alex Chen", avatar_url: null, xp: 12500, streak: 45, badges: 23 },
  { rank: 2, username: "maya_creates", full_name: "Maya Patel", avatar_url: null, xp: 11200, streak: 32, badges: 21 },
  { rank: 3, username: "james_games", full_name: "James Wilson", avatar_url: null, xp: 10800, streak: 28, badges: 19 },
  { rank: 4, username: "sofia_art", full_name: "Sofia Rodriguez", avatar_url: null, xp: 9500, streak: 21, badges: 17 },
  { rank: 5, username: "kai_code", full_name: "Kai Tanaka", avatar_url: null, xp: 8900, streak: 15, badges: 15 },
];

const communityStats = [
  { label: "Community Members", value: "15K+", icon: Users, color: "text-aethex-400" },
  { label: "Active Creators", value: "2.5K", icon: Star, color: "text-gold-400" },
  { label: "XP Earned This Month", value: "1.2M", icon: Zap, color: "text-amber-400" },
  { label: "Badges Awarded", value: "45K", icon: Trophy, color: "text-red-400" },
];

const upcomingEvents = [
  {
    title: "Community Game Jam",
    date: "Dec 15, 2025",
    type: "Event",
    attendees: 234,
  },
  {
    title: "Monthly Town Hall",
    date: "Dec 20, 2025",
    type: "Meeting",
    attendees: 156,
  },
  {
    title: "Shader Workshop",
    date: "Dec 22, 2025",
    type: "Workshop",
    attendees: 89,
  },
];

export default function Community() {
  const navigate = useNavigate();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [loading, setLoading] = useState(true);
  const [selectedArm, setSelectedArm] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/creators?sort=last_active&limit=6");
        if (res.ok) {
          const data = await res.json();
          setCreators(data.creators || []);
        }
      } catch (error) {
        console.error("Failed to fetch creators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCreators = selectedArm
    ? creators.filter((c) => c.arms.includes(selectedArm))
    : creators;

  return (
    <>
      <SEO
        pageTitle="Community"
        description="Join the AeThex Foundation community. Connect with creators, compete on leaderboards, and participate in events."
      />
      <Layout>
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden pb-12">
          {/* Identity-Verified Community Banner */}
          <div className="bg-gradient-to-r from-aethex-500/10 to-neon-blue/10 border-b border-aethex-400/20 py-3 relative z-30">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="flex items-center gap-3 text-sm">
                <Badge variant="outline" className="text-xs">Identity-Verified Ecosystem</Badge>
                <p className="text-muted-foreground">
                  All members verified through AeThex Passport - Trusted, authenticated community
                </p>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-aethex-900/30 via-background to-red-900/20" />
          <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-aethex-500/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl" />

          <main className="relative z-10">
            <section className="py-16">
              <div className="container mx-auto max-w-7xl px-4">
                <div className="text-center space-y-4 mb-12">
                  <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
                    Foundation Community
                  </Badge>
                  <h1 className="text-4xl sm:text-5xl font-bold">
                    <span className="text-gradient bg-gradient-to-r from-aethex-500 via-red-500 to-gold-500 bg-clip-text text-transparent">
                      Community
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Connect with creators, mentors, and builders shaping the future.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {communityStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={index} className="bg-card/60 backdrop-blur-sm border-border/30 text-center">
                        <CardContent className="pt-6">
                          <Icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                          <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto max-w-7xl px-4">
                <Tabs defaultValue="creators" className="space-y-8">
                  <TabsList className="bg-card/60 border border-border/30">
                    <TabsTrigger value="creators" className="data-[state=active]:bg-aethex-500/20">
                      <Users className="h-4 w-4 mr-2" />
                      Creators
                    </TabsTrigger>
                    <TabsTrigger value="leaderboard" className="data-[state=active]:bg-aethex-500/20">
                      <Trophy className="h-4 w-4 mr-2" />
                      Leaderboard
                    </TabsTrigger>
                    <TabsTrigger value="events" className="data-[state=active]:bg-aethex-500/20">
                      <Calendar className="h-4 w-4 mr-2" />
                      Events
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="creators" className="space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <h2 className="text-2xl font-bold">Featured Creators</h2>
                      <div className="flex gap-2">
                        <Filter className="h-5 w-5 text-muted-foreground" />
                        {["FOUNDATION", "GAMEFORGE", "ETHOS", "LABS"].map((arm) => (
                          <Button
                            key={arm}
                            size="sm"
                            variant={selectedArm === arm ? "default" : "outline"}
                            onClick={() => setSelectedArm(selectedArm === arm ? null : arm)}
                            className={selectedArm === arm ? "" : ARM_COLORS[arm].text}
                          >
                            {arm}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-aethex-400" />
                      </div>
                    ) : filteredCreators.length === 0 ? (
                      <Card className="bg-card/60 border-border/30">
                        <CardContent className="p-12 text-center">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No creators found matching your filter.</p>
                          <Button variant="link" onClick={() => setSelectedArm(null)} className="mt-2">
                            Clear filter
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCreators.map((creator) => (
                          <Link key={creator.username} to={`/${creator.username}`} className="block group">
                            <Card className="h-full bg-card/60 border-border/30 hover:border-aethex-400/50 transition-all duration-300 hover:translate-y-[-2px]">
                              <CardContent className="p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                  <Avatar className="h-16 w-16 ring-2 ring-border group-hover:ring-aethex-400 transition-all">
                                    <AvatarImage src={creator.avatar_url || undefined} alt={creator.full_name} />
                                    <AvatarFallback className="bg-gradient-to-br from-aethex-500 to-red-500 text-white font-bold">
                                      {creator.full_name.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3 className="font-bold text-lg truncate">{creator.full_name}</h3>
                                      {creator.is_architect && (
                                        <Shield className="h-5 w-5 text-gold-400" />
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">@{creator.username}</p>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{creator.bio}</p>
                                {creator.arms.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {creator.arms.map((arm) => (
                                      <Badge
                                        key={arm}
                                        variant="outline"
                                        className={`${ARM_COLORS[arm]?.bg} ${ARM_COLORS[arm]?.text} border ${ARM_COLORS[arm]?.border}`}
                                      >
                                        {arm}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="leaderboard" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Top Contributors</h2>
                      <Badge variant="outline" className="border-gold-400/30 text-gold-400">
                        This Month
                      </Badge>
                    </div>

                    <Card className="bg-card/60 border-border/30 overflow-hidden">
                      <div className="divide-y divide-border/30">
                        {leaderboard.map((entry) => (
                          <div
                            key={entry.username}
                            className="flex items-center gap-4 p-4 hover:bg-card/80 transition-colors"
                          >
                            <div className="w-8 text-center">
                              {entry.rank === 1 ? (
                                <Crown className="h-6 w-6 text-gold-400 mx-auto" />
                              ) : entry.rank === 2 ? (
                                <Crown className="h-5 w-5 text-slate-300 mx-auto" />
                              ) : entry.rank === 3 ? (
                                <Crown className="h-5 w-5 text-amber-600 mx-auto" />
                              ) : (
                                <span className="text-muted-foreground font-bold">#{entry.rank}</span>
                              )}
                            </div>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={entry.avatar_url || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-aethex-500 to-red-500 text-white text-sm">
                                {entry.full_name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{entry.full_name}</p>
                              <p className="text-sm text-muted-foreground">@{entry.username}</p>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div className="text-center">
                                <p className="font-bold text-aethex-400">{entry.xp.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">XP</p>
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-amber-400 flex items-center gap-1">
                                  <Flame className="h-4 w-4" />
                                  {entry.streak}
                                </p>
                                <p className="text-xs text-muted-foreground">Streak</p>
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-gold-400">{entry.badges}</p>
                                <p className="text-xs text-muted-foreground">Badges</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="events" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Upcoming Events</h2>
                      <Button variant="outline" className="border-aethex-400/30">
                        View All
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {upcomingEvents.map((event, index) => (
                        <Card key={index} className="bg-card/60 border-border/30 hover:border-aethex-400/50 transition-all">
                          <CardContent className="p-6 space-y-4">
                            <Badge variant="outline" className="border-aethex-400/30 text-aethex-400">
                              {event.type}
                            </Badge>
                            <h3 className="font-bold text-lg">{event.title}</h3>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {event.attendees}
                              </span>
                            </div>
                            <Button className="w-full bg-gradient-to-r from-aethex-500 to-red-600">
                              RSVP
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </section>

            <section className="py-12 border-t border-border/30">
              <div className="container mx-auto max-w-7xl px-4">
                <Card className="bg-gradient-to-r from-aethex-500/10 to-red-500/10 border border-aethex-400/20">
                  <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Join the Community</h3>
                      <p className="text-muted-foreground">
                        Create your profile, connect with others, and start earning XP and badges.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Button asChild variant="outline" className="border-aethex-400/30">
                        <Link to="/login">Sign In</Link>
                      </Button>
                      <Button asChild className="bg-gradient-to-r from-aethex-500 to-red-600">
                        <Link to="/signup">
                          Get Started
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
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
