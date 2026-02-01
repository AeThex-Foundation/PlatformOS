import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Rocket,
  Code,
  Palette,
  Music,
  FileText,
  TrendingUp,
  Play
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Sprint {
  id: string;
  gameName: string;
  month: string;
  status: "ideation" | "prototyping" | "development" | "polish" | "shipping";
  progress: number;
  startDate: string;
  endDate: string;
  teamSize: number;
  currentPhase: string;
  daysRemaining: number;
  completedTasks: number;
  totalTasks: number;
  highlights: string[];
  team: {
    lead: string;
    programmers: number;
    artists: number;
    designers: number;
  };
}

export default function GameForgePipeline() {
  const navigate = useNavigate();

  // Sample sprint data - replace with API
  const currentSprints: Sprint[] = [
    {
      id: "1",
      gameName: "Quantum Runners",
      month: "February 2026",
      status: "development",
      progress: 65,
      startDate: "2026-01-15",
      endDate: "2026-02-15",
      teamSize: 8,
      currentPhase: "Core Mechanics Implementation",
      daysRemaining: 12,
      completedTasks: 48,
      totalTasks: 74,
      highlights: [
        "Multiplayer netcode complete",
        "First 10 levels playable",
        "Character progression system working"
      ],
      team: {
        lead: "Sarah Chen",
        programmers: 3,
        artists: 2,
        designers: 2
      }
    },
    {
      id: "2",
      gameName: "Puzzle Dimension",
      month: "March 2026",
      status: "prototyping",
      progress: 25,
      startDate: "2026-02-01",
      endDate: "2026-03-01",
      teamSize: 5,
      currentPhase: "Prototype Testing",
      daysRemaining: 18,
      completedTasks: 12,
      totalTasks: 45,
      highlights: [
        "Core puzzle mechanic validated",
        "UI mockups complete",
        "First playable build ready"
      ],
      team: {
        lead: "Marcus Wei",
        programmers: 2,
        artists: 1,
        designers: 2
      }
    },
    {
      id: "3",
      gameName: "Story Forge",
      month: "April 2026",
      status: "ideation",
      progress: 10,
      startDate: "2026-02-08",
      endDate: "2026-04-08",
      teamSize: 6,
      currentPhase: "Concept Development",
      daysRemaining: 25,
      completedTasks: 5,
      totalTasks: 50,
      highlights: [
        "Narrative framework designed",
        "Art direction finalized",
        "Target platforms selected"
      ],
      team: {
        lead: "Elena Rodriguez",
        programmers: 2,
        artists: 2,
        designers: 1
      }
    }
  ];

  const phases = [
    { name: "Ideation", icon: FileText, duration: "1 week", color: "purple" },
    { name: "Prototyping", icon: Code, duration: "1 week", color: "blue" },
    { name: "Development", icon: Rocket, duration: "3 weeks", color: "green" },
    { name: "Polish & QA", icon: Palette, duration: "1 week", color: "yellow" },
    { name: "Shipping", icon: Play, duration: "1 day", color: "red" }
  ];

  const statusColors = {
    ideation: "from-purple-500 to-purple-600",
    prototyping: "from-blue-500 to-blue-600",
    development: "from-green-500 to-green-600",
    polish: "from-yellow-500 to-yellow-600",
    shipping: "from-red-500 to-red-600"
  };

  const statusBadgeColors = {
    ideation: "bg-purple-500/20 text-purple-300 border-purple-400/40",
    prototyping: "bg-blue-500/20 text-blue-300 border-blue-400/40",
    development: "bg-green-500/20 text-green-300 border-green-400/40",
    polish: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
    shipping: "bg-red-500/20 text-red-300 border-red-400/40"
  };

  return (
    <>
      <SEO
        pageTitle="Production Pipeline - GameForge"
        description="Live view of GameForge's monthly production pipeline. See games being built in real-time."
      />
      <Layout>
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
          {/* Background */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />

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
                  <Rocket className="h-12 w-12 text-green-400" />
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-black text-green-300">
                      Production Pipeline
                    </h1>
                    <p className="text-lg text-green-100/70 mt-2">
                      Live view of games in development
                    </p>
                  </div>
                </div>

                {/* Pipeline Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <Card className="bg-green-950/30 border-green-400/40">
                    <CardContent className="pt-6 text-center">
                      <p className="text-2xl font-bold text-green-400">3</p>
                      <p className="text-sm text-green-200/70">Active Sprints</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-950/30 border-green-400/40">
                    <CardContent className="pt-6 text-center">
                      <p className="text-2xl font-bold text-green-400">19</p>
                      <p className="text-sm text-green-200/70">Team Members</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-950/30 border-green-400/40">
                    <CardContent className="pt-6 text-center">
                      <p className="text-2xl font-bold text-green-400">65</p>
                      <p className="text-sm text-green-200/70">Tasks This Week</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-950/30 border-green-400/40">
                    <CardContent className="pt-6 text-center">
                      <p className="text-2xl font-bold text-green-400">98%</p>
                      <p className="text-sm text-green-200/70">On Schedule</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Development Process */}
            <section className="py-12 bg-black/40 border-b border-green-400/10">
              <div className="container mx-auto max-w-7xl px-4">
                <h2 className="text-2xl font-bold text-green-300 mb-8">
                  Our 32-Day Development Cycle
                </h2>
                <div className="grid md:grid-cols-5 gap-4">
                  {phases.map((phase, idx) => (
                    <Card key={idx} className="bg-green-950/20 border-green-400/30">
                      <CardContent className="pt-6 text-center">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${statusColors[phase.name.toLowerCase().replace(/\s+/g, '')]} flex items-center justify-center mx-auto mb-3`}>
                          <phase.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-green-300 mb-1">{phase.name}</h3>
                        <p className="text-xs text-green-200/60">{phase.duration}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Active Sprints */}
            <section className="py-16">
              <div className="container mx-auto max-w-7xl px-4">
                <h2 className="text-3xl font-bold text-green-300 mb-8">
                  Active Sprints
                </h2>

                <div className="space-y-8">
                  {currentSprints.map((sprint) => (
                    <Card key={sprint.id} className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={statusBadgeColors[sprint.status]}>
                                {sprint.status.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="border-green-400/40 text-green-300">
                                {sprint.month}
                              </Badge>
                            </div>
                            <CardTitle className="text-2xl text-green-300">
                              {sprint.gameName}
                            </CardTitle>
                            <p className="text-sm text-green-100/60 mt-1">
                              {sprint.currentPhase}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-green-400">
                              {sprint.progress}%
                            </p>
                            <p className="text-xs text-green-200/60">Complete</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-green-200/70">
                              {sprint.completedTasks} of {sprint.totalTasks} tasks
                            </span>
                            <span className="text-green-200/70">
                              {sprint.daysRemaining} days remaining
                            </span>
                          </div>
                          <Progress value={sprint.progress} className="h-3" />
                        </div>

                        {/* Team Info */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-semibold text-green-400 mb-3">
                              TEAM COMPOSITION
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-green-200/70">Project Lead</span>
                                <span className="font-medium text-green-300">{sprint.team.lead}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-green-200/70 flex items-center gap-1">
                                  <Code className="h-3 w-3" /> Programmers
                                </span>
                                <span className="font-medium text-green-300">{sprint.team.programmers}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-green-200/70 flex items-center gap-1">
                                  <Palette className="h-3 w-3" /> Artists
                                </span>
                                <span className="font-medium text-green-300">{sprint.team.artists}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-green-200/70 flex items-center gap-1">
                                  <FileText className="h-3 w-3" /> Designers
                                </span>
                                <span className="font-medium text-green-300">{sprint.team.designers}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-green-400 mb-3">
                              RECENT HIGHLIGHTS
                            </h4>
                            <div className="space-y-2">
                              {sprint.highlights.map((highlight, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-green-100/80">{highlight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-2 text-sm text-green-200/70">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(sprint.startDate).toLocaleDateString()} -{" "}
                            {new Date(sprint.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="py-16 border-t border-green-400/10 bg-black/40">
              <div className="container mx-auto max-w-4xl px-4 text-center">
                <h2 className="text-3xl font-bold text-green-300 mb-4">
                  Want to Join a Sprint?
                </h2>
                <p className="text-lg text-green-100/80 mb-8">
                  GameForge is looking for talented developers, artists, and designers to join upcoming sprints.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    className="bg-green-400 text-black hover:bg-green-300"
                    onClick={() => navigate("/gameforge/join-gameforge")}
                  >
                    Join the Team
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-400/40 text-green-300"
                    onClick={() => navigate("/gameforge/about")}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </Layout>
    </>
  );
}
