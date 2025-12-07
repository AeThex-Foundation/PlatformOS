import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Zap,
  Target,
  Network,
  Sparkles,
  ArrowRight,
  Music,
  Shield,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useArmToast } from "@/hooks/use-arm-toast";
import AudioTracksForSale from "@/components/nexus/AudioTracksForSale";
import AudioServicesForHire from "@/components/nexus/AudioServicesForHire";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Nexus() {
  const navigate = useNavigate();
  const armToast = useArmToast();
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        armToast.system("Connected to the Nexus Guild");
        toastShownRef.current = true;
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [armToast]);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Entering the Nexus..."
        showProgress={true}
        duration={900}
        accentColor="from-red-500 to-amber-400"
      />
    );
  }

  const features = [
    {
      icon: Users,
      title: "One Unified Guild",
      description:
        "Coders, artists, musicians, and designers united under one collective identity.",
    },
    {
      icon: GraduationCap,
      title: "Foundation Certified",
      description:
        "All members are trained and certified by the AeThex Foundation.",
    },
    {
      icon: Network,
      title: "Cross-Division Collaboration",
      description:
        "Ethos, Forge, and Visuals divisions working together on shared projects.",
    },
    {
      icon: Shield,
      title: "Verified Identity",
      description:
        "Every member holds an AeThex Passport with verified credentials.",
    },
    {
      icon: Target,
      title: "Skill Matching",
      description:
        "Find collaborators based on skills, experience, and division alignment.",
    },
    {
      icon: Zap,
      title: "Direct Collaboration",
      description:
        "Connect directly with guild members for projects and opportunities.",
    },
  ];

  const stats = [
    { label: "Guild Members", value: "1000+" },
    { label: "Active Projects", value: "500+" },
    { label: "Divisions", value: "3" },
    { label: "Certified", value: "100%" },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds - Foundation Red/Gold theme */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#ef4444_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(239,68,68,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(251,191,36,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute top-1/2 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 lg:py-28">
            <div className="container mx-auto max-w-6xl px-4 text-center">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <Badge
                  variant="outline"
                  className="border-amber-400/40 bg-red-500/10 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Foundation Certified
                </Badge>

                <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="text-red-400">The</span>{" "}
                  <span className="text-amber-400">Nexus</span>
                </h1>

                <p className="text-lg text-amber-100/90 sm:text-xl max-w-2xl">
                  The unified guild of all AeThex creators. Coders, artists, musicians, 
                  and designers working together as one collective workforce, 
                  certified by the Foundation.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.35)] transition hover:bg-red-600"
                    onClick={() => navigate("/creators")}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Explore the Guild
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-amber-400/40 text-amber-300 hover:bg-amber-500/10"
                    onClick={() => navigate("/passport")}
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    Get Certified
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="border-y border-amber-400/10 bg-black/80 py-12">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-amber-400">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-amber-200/60 mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-amber-300 mb-4">
                  One Monolith. One Workforce.
                </h2>
                <p className="text-amber-200/70">
                  The greatest breakthroughs happen when disciplines collide.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={feature.title}
                      className="bg-red-950/20 border-amber-400/30 hover:border-amber-400/60 transition-colors"
                    >
                      <CardHeader>
                        <Icon className="h-8 w-8 text-amber-400 mb-2" />
                        <CardTitle className="text-amber-300">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-amber-200/70">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Ethos Division Section */}
          <section className="border-t border-amber-400/10 bg-red-950/10 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-12">
                <Badge className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-500 text-white mb-4">
                  <Music className="h-3 w-3" />
                  Ethos Division
                </Badge>
                <h2 className="text-3xl font-bold text-amber-300 mb-4">
                  Audio & Atmosphere
                </h2>
                <p className="text-amber-200/70 max-w-2xl mx-auto">
                  The soul and vibe of our creations. Ethos Division brings together 
                  composers, sound designers, and audio engineers to collaborate 
                  with Forge and Visuals on unified projects.
                </p>
              </div>

              {/* Tabs for Tracks & Services */}
              <Tabs defaultValue="tracks" className="w-full">
                <TabsList className="mb-8 bg-slate-800/50 border border-amber-700/30">
                  <TabsTrigger
                    value="tracks"
                    className="flex items-center gap-2"
                  >
                    <Music className="h-4 w-4" />
                    Track Library
                  </TabsTrigger>
                  <TabsTrigger
                    value="artists"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Division Members
                  </TabsTrigger>
                </TabsList>

                {/* Tracks Tab */}
                <TabsContent value="tracks" className="space-y-6">
                  <div className="bg-red-950/30 border border-amber-700/30 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-amber-300 mb-2">
                      Shared Audio Resources
                    </h3>
                    <p className="text-amber-200/60 text-sm">
                      Original tracks and assets created by Ethos Division members. 
                      Available for use in Nexus projects under ecosystem licenses.
                    </p>
                  </div>
                  <AudioTracksForSale />
                </TabsContent>

                {/* Artists Tab */}
                <TabsContent value="artists" className="space-y-6">
                  <div className="bg-red-950/30 border border-amber-700/30 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-amber-300 mb-2">
                      Certified Audio Professionals
                    </h3>
                    <p className="text-amber-200/60 text-sm">
                      Foundation-certified composers, sound designers, and audio 
                      engineers. Collaborate directly on GameForge projects or 
                      request custom work for your team.
                    </p>
                  </div>
                  <AudioServicesForHire />
                </TabsContent>
              </Tabs>

              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-amber-400/10">
                <Card className="bg-red-950/20 border-amber-400/30">
                  <CardHeader>
                    <CardTitle className="text-amber-300 text-sm">
                      Artist-First Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-amber-200/70">
                    Artists keep 80% of licensing revenue. The Foundation takes 20% 
                    to support education and growth programs.
                  </CardContent>
                </Card>

                <Card className="bg-red-950/20 border-amber-400/30">
                  <CardHeader>
                    <CardTitle className="text-amber-300 text-sm">
                      Full Ownership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-amber-200/70">
                    Artists retain 100% ownership of their work. License within 
                    the Nexus, externally, or both. Your IP, your choice.
                  </CardContent>
                </Card>

                <Card className="bg-red-950/20 border-amber-400/30">
                  <CardHeader>
                    <CardTitle className="text-amber-300 text-sm">
                      Certified Training
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-amber-200/70">
                    All Ethos members are trained through the Foundation curriculum 
                    and hold verified Passports with skill certifications.
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Divisions Section */}
          <section className="border-t border-amber-400/10 bg-red-950/10 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-amber-300 mb-4">
                  The Three Divisions
                </h2>
                <p className="text-amber-200/70">
                  Sound designers seated at the same table as systems engineers
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: "Ethos Division", emoji: "🎧", desc: "Audio Engineers, Composers, Voice Actors" },
                  { name: "Forge Division", emoji: "💻", desc: "Programmers, Game Designers, Scriptwriters" },
                  { name: "Visuals Division", emoji: "🎨", desc: "3D Modelers, UI/UX Designers, Animators" },
                ].map((division) => (
                  <div
                    key={division.name}
                    className="p-6 rounded-lg border border-amber-400/30 bg-black/40 text-center hover:border-amber-400/60 transition-colors"
                  >
                    <p className="text-4xl mb-3">{division.emoji}</p>
                    <p className="font-bold text-amber-300 text-lg mb-2">{division.name}</p>
                    <p className="text-sm text-amber-200/60">{division.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative py-20">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <div className="rounded-lg border border-amber-400/30 bg-red-950/30 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-amber-300 mb-4">
                  Join the Guild
                </h2>
                <p className="text-amber-200/80 mb-8">
                  Get certified by the Foundation and become part of the unified 
                  creative workforce building the future.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-600"
                    onClick={() => navigate("/creators")}
                  >
                    Meet the Guild
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-amber-400/40 text-amber-300 hover:bg-amber-500/10"
                    onClick={() => navigate("/passport")}
                  >
                    Get Your Passport
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
