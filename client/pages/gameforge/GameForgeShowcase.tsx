import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Gamepad2,
  Users,
  Calendar,
  Star,
  Download,
  Play,
  Code,
  Trophy,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameShowcase {
  id: string;
  title: string;
  tagline: string;
  description: string;
  genre: string[];
  platform: string[];
  releaseDate: string;
  status: "shipped" | "beta" | "alpha" | "development";
  downloads: string;
  rating: number;
  teamSize: number;
  developmentTime: string;
  screenshots: string[];
  trailer?: string;
  features: string[];
  techStack: string[];
  awards?: string[];
  playLink?: string;
  githubLink?: string;
}

export default function GameForgeShowcase() {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<GameShowcase | null>(null);

  // Sample games - replace with API data
  const games: GameShowcase[] = [
    {
      id: "1",
      title: "Pixel Quest: Reckoning",
      tagline: "A retro-inspired action RPG with modern mechanics",
      description: "Embark on an epic journey through pixelated realms filled with challenging combat, deep progression systems, and a compelling story. Features 50+ levels, multiplayer co-op, and daily challenges.",
      genre: ["Action", "RPG", "Adventure"],
      platform: ["Windows", "macOS", "Linux"],
      releaseDate: "January 2025",
      status: "shipped",
      downloads: "50K+",
      rating: 4.8,
      teamSize: 8,
      developmentTime: "32 days",
      screenshots: ["/aethex-logo.png", "/aethex-logo.png", "/aethex-logo.png"],
      features: [
        "60+ hours of gameplay",
        "4-player co-op multiplayer",
        "100+ unique items and weapons",
        "Procedurally generated dungeons",
        "Daily challenge system",
        "Cross-platform save sync"
      ],
      techStack: ["Unity", "C#", "Photon Networking", "Firebase"],
      awards: ["Best Indie Game - GameJam 2025", "Players Choice Award"],
      playLink: "https://pixelquest.game",
      githubLink: "https://github.com/gameforge/pixel-quest"
    },
    {
      id: "2",
      title: "Logic Master Pro",
      tagline: "Train your brain with daily puzzle challenges",
      description: "A comprehensive puzzle game featuring hundreds of hand-crafted logic puzzles, daily challenges, and global leaderboards. Perfect for casual players and puzzle enthusiasts alike.",
      genre: ["Puzzle", "Strategy", "Educational"],
      platform: ["Web", "iOS", "Android"],
      releaseDate: "February 2025",
      status: "beta",
      downloads: "25K+",
      rating: 4.6,
      teamSize: 5,
      developmentTime: "28 days",
      screenshots: ["/aethex-logo.png", "/aethex-logo.png"],
      features: [
        "500+ unique puzzles",
        "Daily challenge mode",
        "Global leaderboards",
        "Hint system for beginners",
        "Achievement tracking",
        "Offline play support"
      ],
      techStack: ["React", "TypeScript", "React Native", "Supabase"],
      playLink: "https://logicmaster.game"
    },
    {
      id: "3",
      title: "Mystic Realms: Awakening",
      tagline: "An immersive story-driven RPG",
      description: "Dive into a rich fantasy world with branching narratives, complex character progression, and tactical combat. Features 100+ hours of content and procedurally generated dungeons for endless replayability.",
      genre: ["RPG", "Fantasy", "Story-Rich"],
      platform: ["Windows", "Steam Deck"],
      releaseDate: "March 2025",
      status: "development",
      downloads: "Beta Testing",
      rating: 0,
      teamSize: 12,
      developmentTime: "45 days (in progress)",
      screenshots: ["/aethex-logo.png"],
      features: [
        "100+ hours of main story",
        "Branching narrative paths",
        "Complex character builds",
        "Tactical turn-based combat",
        "Procedural dungeon generation",
        "Mod support at launch"
      ],
      techStack: ["Unreal Engine 5", "C++", "Blueprints", "PostgreSQL"]
    }
  ];

  const statusColors = {
    shipped: "bg-green-500/20 text-green-300 border-green-400/40",
    beta: "bg-blue-500/20 text-blue-300 border-blue-400/40",
    alpha: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
    development: "bg-purple-500/20 text-purple-300 border-purple-400/40"
  };

  return (
    <>
      <SEO
        pageTitle="Game Showcase - GameForge"
        description="Explore games built by the GameForge team. Monthly releases, open-source projects, and innovative gameplay."
      />
      <Layout>
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
          {/* Background */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />

          <main className="relative z-10">
            {/* Header */}
            <section className="py-16 border-b border-green-400/10">
              <div className="container mx-auto max-w-7xl px-4">
                <Button
                  variant="ghost"
                  className="text-green-300 hover:bg-green-500/10 mb-8"
                  onClick={() => navigate("/gameforge")}
                >
                  ← Back to GameForge
                </Button>

                <div className="flex items-center gap-4 mb-6">
                  <Gamepad2 className="h-12 w-12 text-green-400" />
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-black text-green-300">
                      Game Showcase
                    </h1>
                    <p className="text-lg text-green-100/70 mt-2">
                      Games shipped by the GameForge production team
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {[
                    { label: "Total Games", value: "15+" },
                    { label: "Active Players", value: "200K+" },
                    { label: "Avg Rating", value: "4.7★" },
                    { label: "This Month", value: "3 Games" }
                  ].map((stat, idx) => (
                    <Card key={idx} className="bg-green-950/30 border-green-400/40">
                      <CardContent className="pt-6 text-center">
                        <p className="text-2xl font-bold text-green-400">{stat.value}</p>
                        <p className="text-sm text-green-200/70">{stat.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Games Grid */}
            <section className="py-16">
              <div className="container mx-auto max-w-7xl px-4">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-8">
                    <TabsTrigger value="all">All Games</TabsTrigger>
                    <TabsTrigger value="shipped">Shipped</TabsTrigger>
                    <TabsTrigger value="beta">Beta</TabsTrigger>
                    <TabsTrigger value="development">In Development</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-8">
                    {games.map((game) => (
                      <Card
                        key={game.id}
                        className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-all cursor-pointer"
                        onClick={() => setSelectedGame(game)}
                      >
                        <CardContent className="pt-6">
                          <div className="grid md:grid-cols-[300px,1fr] gap-6">
                            {/* Game Image */}
                            <div className="bg-gradient-to-br from-green-900/30 to-black rounded-lg aspect-video md:aspect-square flex items-center justify-center border border-green-400/20">
                              <Gamepad2 className="h-16 w-16 text-green-400/40" />
                            </div>

                            {/* Game Info */}
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge className={statusColors[game.status]}>
                                    {game.status.toUpperCase()}
                                  </Badge>
                                  {game.awards && game.awards.length > 0 && (
                                    <Trophy className="h-4 w-4 text-yellow-400" />
                                  )}
                                </div>
                                <h2 className="text-2xl font-bold text-green-300 mb-1">
                                  {game.title}
                                </h2>
                                <p className="text-sm text-green-100/60 mb-3">
                                  {game.tagline}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {game.genre.map((g, idx) => (
                                    <Badge key={idx} variant="outline" className="border-green-400/40 text-green-300">
                                      {g}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <p className="text-green-100/80 line-clamp-2">
                                {game.description}
                              </p>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                {game.status === "shipped" && (
                                  <div>
                                    <p className="text-green-400 text-xs mb-1">DOWNLOADS</p>
                                    <p className="font-semibold text-green-300">{game.downloads}</p>
                                  </div>
                                )}
                                {game.rating > 0 && (
                                  <div>
                                    <p className="text-green-400 text-xs mb-1">RATING</p>
                                    <p className="font-semibold text-green-300 flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      {game.rating}/5
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-green-400 text-xs mb-1">TEAM SIZE</p>
                                  <p className="font-semibold text-green-300">{game.teamSize} devs</p>
                                </div>
                                <div>
                                  <p className="text-green-400 text-xs mb-1">DEV TIME</p>
                                  <p className="font-semibold text-green-300">{game.developmentTime}</p>
                                </div>
                              </div>

                              <div className="flex gap-3">
                                <Button
                                  className="bg-green-400 text-black hover:bg-green-300"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedGame(game);
                                  }}
                                >
                                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                {game.playLink && (
                                  <Button
                                    variant="outline"
                                    className="border-green-400/40 text-green-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(game.playLink, '_blank');
                                    }}
                                  >
                                    <Play className="mr-2 h-4 w-4" />
                                    Play Now
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  {/* Other tab contents can filter by status */}
                  {["shipped", "beta", "development"].map((status) => (
                    <TabsContent key={status} value={status} className="space-y-8">
                      {games
                        .filter((game) => game.status === status)
                        .map((game) => (
                          <div key={game.id}>
                            {/* Same card layout as above */}
                            <p className="text-green-300">Game cards filtered by {status}</p>
                          </div>
                        ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </section>
          </main>
        </div>

        {/* Game Detail Modal */}
        <Dialog open={selectedGame !== null} onOpenChange={() => setSelectedGame(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black border-green-400/40">
            {selectedGame && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-green-300">
                    {selectedGame.title}
                  </DialogTitle>
                  <DialogDescription className="text-green-100/70 text-base">
                    {selectedGame.tagline}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Screenshots */}
                  <div className="bg-gradient-to-br from-green-900/30 to-black rounded-lg aspect-video flex items-center justify-center border border-green-400/20">
                    <Gamepad2 className="h-24 w-24 text-green-400/40" />
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-bold text-green-300 mb-3">About</h3>
                    <p className="text-green-100/80">{selectedGame.description}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-xl font-bold text-green-300 mb-3">Features</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {selectedGame.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                          <span className="text-green-100/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h3 className="text-xl font-bold text-green-300 mb-3 flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGame.techStack.map((tech, idx) => (
                        <Badge key={idx} className="bg-green-500/20 text-green-300 border-green-400/40">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Awards */}
                  {selectedGame.awards && selectedGame.awards.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-green-300 mb-3 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        Awards
                      </h3>
                      <div className="space-y-2">
                        {selectedGame.awards.map((award, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-green-100/80">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {award}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-green-400/20">
                    {selectedGame.playLink && (
                      <Button
                        className="bg-green-400 text-black hover:bg-green-300"
                        onClick={() => window.open(selectedGame.playLink, '_blank')}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Play Now
                      </Button>
                    )}
                    {selectedGame.githubLink && (
                      <Button
                        variant="outline"
                        className="border-green-400/40 text-green-300"
                        onClick={() => window.open(selectedGame.githubLink, '_blank')}
                      >
                        <Code className="mr-2 h-4 w-4" />
                        View Source
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Layout>
    </>
  );
}
