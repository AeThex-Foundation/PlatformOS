/**
 * Workshops Page
 * Foundation workshop system - registration, upcoming events, past recordings
 */

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  BookOpen,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";

interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  date: string;
  time: string;
  duration: number; // minutes
  capacity: number;
  registered: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  tags: string[];
  status: "upcoming" | "live" | "completed";
  recordingUrl?: string;
  materialsUrl?: string;
}

export default function Workshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredWorkshops, setRegisteredWorkshops] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchWorkshops = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/workshops');
        if (res.ok) {
          const data = await res.json();
          const mapped: Workshop[] = data.workshops.map((w: any) => ({
            id: w.id,
            title: w.title,
            description: w.description,
            instructor: w.instructor_name,
            date: new Date(w.start_time).toISOString().split('T')[0],
            time: new Date(w.start_time).toTimeString().slice(0, 5),
            duration: Math.round((new Date(w.end_time).getTime() - new Date(w.start_time).getTime()) / 60000),
            capacity: w.capacity,
            registered: w.registered_count,
            level: "Beginner" as const,
            category: w.tags[0] || "Workshop",
            tags: w.tags || [],
            status: w.status,
            recordingUrl: w.recording_url,
          }));
          setWorkshops(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch workshops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const handleRegister = async (workshopId: string) => {
    try {
      const res = await fetch(`/api/workshops/${workshopId}/register`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setRegisteredWorkshops(prev => new Set(prev).add(workshopId));
      }
    } catch (error) {
      console.error('Failed to register for workshop:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500/10 text-green-400 border-green-400/30";
      case "Intermediate": return "bg-blue-500/10 text-blue-400 border-blue-400/30";
      case "Advanced": return "bg-purple-500/10 text-purple-400 border-purple-400/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-400/30";
    }
  };

  const getStatusBadge = (workshop: Workshop) => {
    if (workshop.status === "live") {
      return (
        <Badge className="bg-red-500/10 text-red-400 border-red-400/30 animate-pulse">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          LIVE NOW
        </Badge>
      );
    }
    if (workshop.status === "completed") {
      return (
        <Badge variant="outline" className="border-muted-foreground/30">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }
    return null;
  };

  const renderWorkshopCard = (workshop: Workshop) => {
    const isRegistered = registeredWorkshops.has(workshop.id);
    const isFull = workshop.registered >= workshop.capacity;
    const spotsLeft = workshop.capacity - workshop.registered;

    return (
      <Card key={workshop.id} className="border-border/30 hover:border-aethex-400/50 transition-all">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge(workshop)}
                <Badge variant="outline" className={getLevelColor(workshop.level)}>
                  {workshop.level}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {workshop.category}
                </Badge>
              </div>
              <CardTitle className="text-xl">{workshop.title}</CardTitle>
            </div>
          </div>
          <CardDescription>{workshop.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Workshop Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-aethex-400" />
              <span>{new Date(workshop.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-aethex-400" />
              <span>{workshop.time} ({workshop.duration} min)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 text-aethex-400" />
              <span>
                {workshop.registered}/{workshop.capacity} registered
                {!isFull && workshop.status === "upcoming" && (
                  <span className="text-green-400 ml-1">({spotsLeft} spots left)</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="h-4 w-4 text-aethex-400" />
              <span>{workshop.instructor}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {workshop.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {workshop.status === "upcoming" && (
              <>
                {isRegistered ? (
                  <Button variant="outline" className="flex-1 border-green-500/50" disabled>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Registered
                  </Button>
                ) : isFull ? (
                  <Button variant="outline" className="flex-1 border-red-500/50" disabled>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Full
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleRegister(workshop.id)}
                    className="flex-1 bg-gradient-to-r from-aethex-500 to-gold-500"
                  >
                    Register Now
                  </Button>
                )}
              </>
            )}
            {workshop.status === "live" && (
              <Button className="flex-1 bg-gradient-to-r from-red-500 to-amber-500 animate-pulse">
                <Play className="h-4 w-4 mr-2" />
                Join Live Session
              </Button>
            )}
            {workshop.status === "completed" && (
              <>
                {workshop.recordingUrl && (
                  <Button variant="outline" className="flex-1 border-aethex-500/50">
                    <Video className="h-4 w-4 mr-2" />
                    Watch Recording
                  </Button>
                )}
                {workshop.materialsUrl && (
                  <Button variant="outline" className="border-gold-500/50">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Materials
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const upcomingWorkshops = workshops.filter(w => w.status === "upcoming");
  const liveWorkshops = workshops.filter(w => w.status === "live");
  const completedWorkshops = workshops.filter(w => w.status === "completed");

  return (
    <>
      <SEO
        pageTitle="Workshops"
        description="Join Foundation workshops and learning sessions - game development, programming, design, and more"
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-12">
          {/* Header */}
          <section className="space-y-4">
            <Badge variant="outline" className="border-aethex-400/50 text-aethex-400">
              Education & Training
            </Badge>
            <h1 className="text-4xl font-bold">
              <span className="text-gradient bg-gradient-to-r from-aethex-500 via-amber-400 to-gold-500 bg-clip-text text-transparent">
                Foundation Workshops
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Learn from industry experts through live workshops, hands-on sessions, and collaborative learning
            </p>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/30 bg-gradient-to-br from-aethex-500/5 to-gold-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-aethex-500/20">
                    <Calendar className="h-8 w-8 text-aethex-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-bold">{upcomingWorkshops.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/30 bg-gradient-to-br from-amber-500/5 to-gold-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-amber-500/20">
                    <Users className="h-8 w-8 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="text-2xl font-bold">500+</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/30 bg-gradient-to-br from-gold-500/5 to-amber-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gold-500/20">
                    <Video className="h-8 w-8 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recordings</p>
                    <p className="text-2xl font-bold">{completedWorkshops.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Workshop Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingWorkshops.length})
              </TabsTrigger>
              <TabsTrigger value="live">
                Live ({liveWorkshops.length})
              </TabsTrigger>
              <TabsTrigger value="recordings">
                Recordings ({completedWorkshops.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingWorkshops.length === 0 ? (
                <Card className="border-border/30">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No upcoming workshops at the moment</p>
                    <p className="text-sm text-muted-foreground mt-2">Check back soon for new sessions!</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingWorkshops.map(renderWorkshopCard)
              )}
            </TabsContent>

            <TabsContent value="live" className="space-y-6">
              {liveWorkshops.length === 0 ? (
                <Card className="border-border/30">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No live workshops right now</p>
                  </CardContent>
                </Card>
              ) : (
                liveWorkshops.map(renderWorkshopCard)
              )}
            </TabsContent>

            <TabsContent value="recordings" className="space-y-6">
              {completedWorkshops.map(renderWorkshopCard)}
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <section className="bg-gradient-to-r from-aethex-500/10 to-gold-500/10 rounded-xl p-8 border border-aethex-400/20 text-center">
            <BookOpen className="h-12 w-12 text-aethex-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Want to host a workshop?</h2>
            <p className="text-muted-foreground mb-6">
              Share your expertise with the Foundation community
            </p>
            <Link to="/contact">
              <Button className="bg-gradient-to-r from-aethex-500 to-gold-500">
                Propose a Workshop
              </Button>
            </Link>
          </section>
        </div>
      </Layout>
    </>
  );
}
