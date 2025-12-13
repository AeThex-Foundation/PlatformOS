import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, ArrowRight, Loader2, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameRelease {
  id: string;
  name: string;
  description: string;
  platform: string;
  genre: string[];
  actual_release_date: string;
  team_size: number;
  user_profiles?: {
    id: string;
    full_name: string;
    avatar_url: string;
    username: string;
  };
}

interface ReleasesResponse {
  releases: GameRelease[];
  total: number;
}

export default function GameForgeViewPortfolio() {
  const navigate = useNavigate();
  const [releases, setReleases] = useState<GameRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReleases() {
      try {
        const response = await fetch("/api/gameforge/releases");
        if (!response.ok) {
          throw new Error("Failed to fetch releases");
        }
        const data: ReleasesResponse = await response.json();
        setReleases(data.releases);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReleases();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-green-300 hover:bg-green-500/10 mb-8"
                onClick={() => navigate("/gameforge")}
              >
                ← Back to GameForge
              </Button>

              <h1 className="text-4xl lg:text-5xl font-black text-green-300 mb-4">
                Released Games
              </h1>
              <p className="text-lg text-green-100/80 max-w-3xl">
                Games shipped by GameForge graduates. Verified portfolio credits
                for our program alumni.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-green-400" />
                  <span className="ml-3 text-green-300">Loading releases...</span>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-400 mb-4">{error}</p>
                  <Button
                    variant="outline"
                    className="border-green-400 text-green-300"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : releases.length === 0 ? (
                <div className="text-center py-20">
                  <Gamepad2 className="h-16 w-16 text-green-400/40 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-300 mb-2">
                    No Releases Yet
                  </h3>
                  <p className="text-green-100/60">
                    Games will appear here once they're released by our program graduates.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {releases.map((game) => (
                    <Card
                      key={game.id}
                      className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-all"
                    >
                      <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-green-300 mb-1">
                              {game.name}
                            </h3>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {(game.genre || []).map((g, idx) => (
                                <Badge
                                  key={idx}
                                  className="bg-green-500/20 text-green-300 border border-green-400/40 text-xs"
                                >
                                  {g}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-sm text-green-200/60 line-clamp-2">
                              {game.description}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-green-400">
                              PLATFORM
                            </p>
                            <p className="text-lg font-bold text-green-300">
                              {game.platform || "Multiple"}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-green-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> RELEASED
                            </p>
                            <p className="text-lg font-bold text-green-300">
                              {formatDate(game.actual_release_date)}
                            </p>
                            <p className="text-xs text-green-200/60 flex items-center gap-1">
                              <Users className="h-3 w-3" /> {game.team_size || 1} team members
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-green-400">
                              PROJECT LEAD
                            </p>
                            {game.user_profiles ? (
                              <div className="flex items-center gap-2">
                                {game.user_profiles.avatar_url && (
                                  <img
                                    src={game.user_profiles.avatar_url}
                                    alt={game.user_profiles.full_name}
                                    className="w-8 h-8 rounded-full border border-green-400/40"
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-green-300">
                                    {game.user_profiles.full_name}
                                  </p>
                                  <p className="text-xs text-green-200/60">
                                    @{game.user_profiles.username}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-green-200/60">—</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="py-16 border-t border-green-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-green-300 mb-4">
                Games in Development
              </h2>
              <p className="text-lg text-green-100/80 mb-8">
                View the current production pipeline and upcoming releases.
              </p>
              <Button
                className="bg-green-400 text-black hover:bg-green-300"
                onClick={() => navigate("/gameforge/start-building")}
              >
                View Pipeline
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
