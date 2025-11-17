/**
 * Leaderboard Page
 * Displays top contributors by XP, level, streaks, and achievements
 */

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Zap, Flame, Award, Medal, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface LeaderboardEntry {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  total_xp: number;
  level: number;
  badge_count: number;
  current_streak: number | null;
  longest_streak: number | null;
  rank: number;
}

export default function Leaderboard() {
  const [xpLeaders, setXpLeaders] = useState<LeaderboardEntry[]>([]);
  const [streakLeaders, setStreakLeaders] = useState<LeaderboardEntry[]>([]);
  const [badgeLeaders, setBadgeLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      try {
        const [xpRes, streaksRes, badgesRes] = await Promise.all([
          fetch('/api/leaderboard?type=xp&limit=50'),
          fetch('/api/leaderboard?type=streaks&limit=50'),
          fetch('/api/leaderboard?type=badges&limit=50'),
        ]);

        if (xpRes.ok && streaksRes.ok && badgesRes.ok) {
          const xpData = await xpRes.json();
          const streaksData = await streaksRes.json();
          const badgesData = await badgesRes.json();

          setXpLeaders(xpData.leaderboard.map((entry: any) => ({
            id: entry.username,
            username: entry.username,
            full_name: entry.full_name,
            avatar_url: entry.avatar_url,
            total_xp: entry.total_xp,
            level: entry.level,
            badge_count: entry.badge_count,
            current_streak: entry.streak_days,
            longest_streak: entry.streak_days,
            rank: entry.rank,
          })));

          setStreakLeaders(streaksData.leaderboard.map((entry: any) => ({
            id: entry.username,
            username: entry.username,
            full_name: entry.full_name,
            avatar_url: entry.avatar_url,
            total_xp: entry.total_xp,
            level: entry.level,
            badge_count: entry.badge_count,
            current_streak: entry.streak_days,
            longest_streak: entry.streak_days,
            rank: entry.rank,
          })));

          setBadgeLeaders(badgesData.leaderboard.map((entry: any) => ({
            id: entry.username,
            username: entry.username,
            full_name: entry.full_name,
            avatar_url: entry.avatar_url,
            total_xp: entry.total_xp,
            level: entry.level,
            badge_count: entry.badge_count,
            current_streak: entry.streak_days,
            longest_streak: entry.streak_days,
            rank: entry.rank,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboards();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-gold-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-gold-500/20 to-amber-500/20 border-gold-400/30";
    if (rank === 2) return "from-gray-400/20 to-gray-500/20 border-gray-400/30";
    if (rank === 3) return "from-amber-600/20 to-amber-700/20 border-amber-600/30";
    return "from-card/50 to-card/50 border-border/30";
  };

  const renderLeaderboardEntry = (entry: LeaderboardEntry, stat: "xp" | "streak" | "badges") => {
    const statValue = stat === "xp" ? entry.total_xp : stat === "streak" ? entry.current_streak || 0 : entry.badge_count;
    const StatIcon = stat === "xp" ? Zap : stat === "streak" ? Flame : Trophy;

    return (
      <Link key={entry.id} to={`/${entry.username}`}>
        <Card className={`border hover:border-aethex-400/50 transition-all cursor-pointer bg-gradient-to-r ${getRankColor(entry.rank)}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex-shrink-0 w-12 text-center">
                {getRankIcon(entry.rank) || (
                  <div className="text-2xl font-bold text-muted-foreground">
                    #{entry.rank}
                  </div>
                )}
              </div>

              {/* Avatar */}
              <Avatar className="h-12 w-12">
                <AvatarImage src={entry.avatar_url || undefined} alt={entry.full_name} />
                <AvatarFallback className="bg-gradient-to-br from-aethex-500/30 to-amber-500/30">
                  {entry.full_name[0]}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{entry.full_name}</p>
                <p className="text-sm text-muted-foreground truncate">@{entry.username}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-aethex-400/30 flex items-center gap-1">
                  <StatIcon className="h-4 w-4 text-aethex-400" />
                  <span className="font-bold">{statValue.toLocaleString()}</span>
                </Badge>
                <Badge variant="outline" className="border-border/50 text-xs">
                  Level {entry.level}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  );

  return (
    <>
      <SEO
        pageTitle="Leaderboard"
        description="Top contributors and achievers in the AeThex Foundation community"
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-12">
          {/* Header */}
          <section className="space-y-4">
            <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
              Community Rankings
            </Badge>
            <h1 className="text-4xl font-bold">
              <span className="text-gradient bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 bg-clip-text text-transparent">
                Leaderboard
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Celebrating our top contributors, achievers, and community champions
            </p>
          </section>

          {/* Stats Overview */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/30 bg-gradient-to-br from-aethex-500/5 to-gold-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-aethex-500/20">
                    <Zap className="h-8 w-8 text-aethex-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total XP Earned</p>
                    <p className="text-2xl font-bold">1.2M+</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/30 bg-gradient-to-br from-amber-500/5 to-gold-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-amber-500/20">
                    <Flame className="h-8 w-8 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Longest Streak</p>
                    <p className="text-2xl font-bold">90 Days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/30 bg-gradient-to-br from-gold-500/5 to-amber-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gold-500/20">
                    <Trophy className="h-8 w-8 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                    <p className="text-2xl font-bold">250+</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Leaderboard Tabs */}
          <section>
            <Tabs defaultValue="xp" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="xp" className="gap-2">
                  <Zap className="h-4 w-4" />
                  By XP
                </TabsTrigger>
                <TabsTrigger value="streak" className="gap-2">
                  <Flame className="h-4 w-4" />
                  By Streak
                </TabsTrigger>
                <TabsTrigger value="badges" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  By Badges
                </TabsTrigger>
              </TabsList>

              <TabsContent value="xp" className="space-y-4">
                {loading ? <LoadingSkeleton /> : xpLeaders.map((entry) => renderLeaderboardEntry(entry, "xp"))}
              </TabsContent>

              <TabsContent value="streak" className="space-y-4">
                {loading ? <LoadingSkeleton /> : streakLeaders.map((entry) => renderLeaderboardEntry(entry, "streak"))}
              </TabsContent>

              <TabsContent value="badges" className="space-y-4">
                {loading ? <LoadingSkeleton /> : badgeLeaders.map((entry) => renderLeaderboardEntry(entry, "badges"))}
              </TabsContent>
            </Tabs>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-aethex-500/10 to-gold-500/10 rounded-xl p-8 border border-aethex-400/20 text-center">
            <Trophy className="h-12 w-12 text-gold-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Want to climb the ranks?</h2>
            <p className="text-muted-foreground mb-6">
              Contribute to the community, complete bounties, and participate in governance to earn XP and badges
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/hub/community">
                <Badge variant="outline" className="border-aethex-400/50 hover:bg-aethex-400/10 cursor-pointer px-4 py-2">
                  Browse Bounties
                </Badge>
              </Link>
              <Link to="/hub/governance">
                <Badge variant="outline" className="border-gold-400/50 hover:bg-gold-400/10 cursor-pointer px-4 py-2">
                  Vote on Proposals
                </Badge>
              </Link>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
