import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Loader2, Trophy, Star, Zap, Target, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  difficulty: "bronze" | "silver" | "gold" | "platinum";
  category: string;
  earned_count: number;
}

const difficultyColors: Record<"bronze" | "silver" | "gold" | "platinum", string> = {
  bronze: "bg-amber-700/20 text-amber-600 border-amber-700/30",
  silver: "bg-slate-400/20 text-slate-300 border-slate-400/30",
  gold: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  platinum: "bg-red-500/20 text-red-400 border-red-500/30",
};

const mockAchievements: Achievement[] = [
  {
    id: "1",
    name: "First Course Completed",
    description: "Complete your first Foundation course",
    icon: "🎓",
    points: 50,
    difficulty: "bronze",
    category: "Learning",
    earned_count: 1240,
  },
  {
    id: "2",
    name: "Master Mathematician",
    description: "Complete all mathematics courses",
    icon: "🧮",
    points: 200,
    difficulty: "silver",
    category: "Specialty",
    earned_count: 342,
  },
  {
    id: "3",
    name: "Game Developer Pro",
    description: "Complete all game development courses",
    icon: "🎮",
    points: 300,
    difficulty: "gold",
    category: "Specialty",
    earned_count: 234,
  },
  {
    id: "4",
    name: "Knowledge Keeper",
    description: "Contribute 50 hours of learning content",
    icon: "📚",
    points: 150,
    difficulty: "silver",
    category: "Community",
    earned_count: 156,
  },
  {
    id: "5",
    name: "Legendary Mentor",
    description: "Mentor 10 students to course completion",
    icon: "👨‍🏫",
    points: 400,
    difficulty: "platinum",
    category: "Mentorship",
    earned_count: 45,
  },
  {
    id: "6",
    name: "Code Reviewer",
    description: "Review 100 pieces of student code",
    icon: "👀",
    points: 200,
    difficulty: "gold",
    category: "Community",
    earned_count: 89,
  },
  {
    id: "7",
    name: "Weekend Warrior",
    description: "Complete a course in 7 days or less",
    icon: "⚡",
    points: 100,
    difficulty: "bronze",
    category: "Speed",
    earned_count: 567,
  },
  {
    id: "8",
    name: "Perfect Score",
    description: "Achieve 100% on all course assessments",
    icon: "💯",
    points: 250,
    difficulty: "gold",
    category: "Excellence",
    earned_count: 123,
  },
  {
    id: "9",
    name: "Community Builder",
    description: "Help onboard 25 new community members",
    icon: "🤝",
    points: 175,
    difficulty: "silver",
    category: "Community",
    earned_count: 98,
  },
  {
    id: "10",
    name: "Open Source Champion",
    description: "Contribute to 5 Foundation open source projects",
    icon: "🌟",
    points: 350,
    difficulty: "gold",
    category: "Contribution",
    earned_count: 67,
  },
  {
    id: "11",
    name: "Workshop Host",
    description: "Host your first community workshop",
    icon: "🎤",
    points: 200,
    difficulty: "silver",
    category: "Leadership",
    earned_count: 45,
  },
  {
    id: "12",
    name: "Foundation Elder",
    description: "Be an active member for over 1 year",
    icon: "🏛️",
    points: 500,
    difficulty: "platinum",
    category: "Loyalty",
    earned_count: 234,
  },
];

const CATEGORIES = [
  "All",
  "Learning",
  "Specialty",
  "Community",
  "Mentorship",
  "Speed",
  "Excellence",
  "Contribution",
  "Leadership",
  "Loyalty",
];

const stats = [
  { label: "Total Badges", value: "48", icon: Trophy, color: "text-aethex-400" },
  { label: "Active Earners", value: "2.5K", icon: Users, color: "text-gold-400" },
  { label: "Points Awarded", value: "125K", icon: Star, color: "text-amber-400" },
  { label: "Platinum Holders", value: "89", icon: Zap, color: "text-red-400" },
];

export default function Achievements() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userAchievements] = useState<string[]>(["1", "3", "7"]);

  const filteredAchievements =
    selectedCategory === "All"
      ? mockAchievements
      : mockAchievements.filter((a) => a.category === selectedCategory);

  const totalPoints = mockAchievements
    .filter((a) => userAchievements.includes(a.id))
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <>
      <SEO
        pageTitle="Achievements"
        description="Earn badges, unlock rewards, and showcase your progress through the AeThex Foundation achievement system."
      />
      <Layout>
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden pb-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-aethex-900/30 via-background to-gold-900/20" />
          <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-aethex-500/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />

          <main className="relative z-10">
            <section className="py-16 border-b border-border/30">
              <div className="container mx-auto max-w-7xl px-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-aethex-500 to-gold-500 grid place-items-center">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-aethex-400 to-gold-400 bg-clip-text text-transparent">
                        Achievements
                      </h1>
                      <p className="text-muted-foreground">
                        Earn badges and unlock rewards
                      </p>
                    </div>
                  </div>

                  {user && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Your Points</p>
                      <p className="text-3xl font-bold text-aethex-400">{totalPoints}</p>
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  {stats.map((stat, index) => {
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

            {user && (
              <section className="py-6 border-b border-border/30">
                <div className="container mx-auto max-w-7xl px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-card/60 border-border/30">
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-1">Achieved</p>
                        <p className="text-2xl font-bold text-aethex-400">
                          {userAchievements.length}/{mockAchievements.length}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/60 border-border/30">
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-1">Total Points</p>
                        <p className="text-2xl font-bold text-gold-400">{totalPoints}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/60 border-border/30">
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-1">Next Milestone</p>
                        <p className="text-2xl font-bold text-amber-400">500 pts</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>
            )}

            <section className="py-6 border-b border-border/30">
              <div className="container mx-auto max-w-7xl px-4">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedCategory === category
                          ? "bg-aethex-500/20 text-aethex-300 border border-aethex-500/50"
                          : "bg-card/50 text-muted-foreground border border-border/50 hover:border-aethex-400/30"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto max-w-7xl px-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-aethex-400" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredAchievements.map((achievement) => {
                      const isEarned = userAchievements.includes(achievement.id);

                      return (
                        <Card
                          key={achievement.id}
                          className={`border-border/30 transition cursor-pointer ${
                            isEarned
                              ? "bg-card/60 hover:border-aethex-400/50"
                              : "bg-card/30 opacity-60 hover:opacity-80"
                          }`}
                        >
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="text-5xl mb-4">{achievement.icon}</div>
                            <h3 className="font-bold text-foreground mb-2">{achievement.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                            <div className="flex items-center justify-center gap-2 mb-4">
                              <Badge className={difficultyColors[achievement.difficulty]}>
                                {achievement.difficulty.toUpperCase()}
                              </Badge>
                              <Badge className="bg-card/50 text-muted-foreground border-border/30">
                                +{achievement.points} pts
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {achievement.earned_count.toLocaleString()} earned
                            </div>
                            {isEarned && (
                              <div className="mt-4 pt-4 border-t border-border/30 w-full">
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                  <Award className="h-3 w-3 mr-1 inline" />
                                  Unlocked
                                </Badge>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {!user && (
              <section className="py-12 border-t border-border/30">
                <div className="container mx-auto max-w-7xl px-4">
                  <Card className="bg-card/60 border-border/30">
                    <CardContent className="p-12 text-center">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Start Earning Badges</h3>
                      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Sign in to track your achievements, earn points, and unlock exclusive rewards as you progress through Foundation programs.
                      </p>
                      <Button
                        onClick={() => navigate("/login")}
                        className="bg-gradient-to-r from-aethex-500 to-red-600 hover:from-aethex-600 hover:to-red-700"
                      >
                        Sign In
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}
          </main>
        </div>
      </Layout>
    </>
  );
}
