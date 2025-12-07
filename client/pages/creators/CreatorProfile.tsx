import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Award,
  Code,
  Music,
  Shield,
  Star,
  CheckCircle,
  Users,
  Zap,
} from "lucide-react";
import { getCreatorByUsername } from "@/api/creators";
import type { Creator } from "@/api/creators";

const divisionEmojis: Record<string, string> = {
  Ethos: '🎧',
  Forge: '💻',
  Visuals: '🎨',
};

const realmColors: Record<string, string> = {
  'Development Forge': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Strategist Nexus': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Innovation Commons': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Experience Hub': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function CreatorProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCreator = async () => {
      if (!username) return;
      setIsLoading(true);
      try {
        const data = await getCreatorByUsername(username);
        setCreator(data);
      } catch (error) {
        console.error("Failed to fetch creator:", error);
        setCreator(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreator();
  }, [username]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      </Layout>
    );
  }

  if (!creator) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-300 mb-4">Guild Member Not Found</h1>
            <p className="text-amber-200/60 mb-6">
              This passport holder doesn't exist in the Nexus.
            </p>
            <Button onClick={() => navigate("/creators")} className="bg-red-500 hover:bg-red-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Directory
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const xpForNextLevel = 1000;
  const xpProgress = creator.passport_xp ? (creator.passport_xp / xpForNextLevel) * 100 : 0;

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background - Foundation Red/Gold */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#ef4444_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(251,191,36,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />

        <main className="relative z-10">
          <div className="container mx-auto max-w-4xl px-4 py-12">
            {/* Header */}
            <div className="mb-8">
              <Button
                onClick={() => navigate("/creators")}
                variant="ghost"
                className="mb-4 text-amber-300 hover:text-amber-200 hover:bg-red-950/30"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Button>
            </div>

            {/* Passport Card */}
            <Card className="bg-red-950/30 border-amber-700/30 mb-8 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-red-500 to-amber-500" />
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                  <div className="relative">
                    <Avatar className="h-28 w-28 border-4 border-amber-500/30">
                      <AvatarImage
                        src={creator.avatar_url}
                        alt={creator.username}
                      />
                      <AvatarFallback className="bg-red-950 text-amber-400 text-2xl">
                        {creator.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {creator.is_verified && (
                      <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-1">
                        <CheckCircle className="h-6 w-6 text-black" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-white">
                        @{creator.username}
                      </h1>
                      {creator.is_verified && (
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {creator.division && (
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                          {divisionEmojis[creator.division]} {creator.division} Division
                        </Badge>
                      )}
                    </div>
                    
                    {creator.aethex_domain && (
                      <p className="text-amber-400 font-mono text-lg mb-2">
                        {creator.aethex_domain}
                      </p>
                    )}
                    
                    <p className="text-amber-200/80 text-lg mb-4">
                      {creator.bio || "Certified Nexus guild member"}
                    </p>

                    {/* Passport Level & XP */}
                    <div className="bg-black/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-amber-400" />
                          <span className="font-bold text-amber-300">Level {creator.passport_level || 1}</span>
                        </div>
                        <span className="text-sm text-amber-200/60">
                          {creator.passport_xp || 0} / {xpForNextLevel} XP
                        </span>
                      </div>
                      <Progress value={xpProgress} className="h-2 bg-red-950" />
                    </div>

                    {/* Realm Badge */}
                    {creator.realm && (
                      <Badge className={`${realmColors[creator.realm] || 'bg-gray-500/20 text-gray-400'} border mb-4`}>
                        {creator.realm}
                      </Badge>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Collaborate
                      </Button>
                      <Button variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
                        <Zap className="h-4 w-4 mr-2" />
                        Endorse
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ARM Affiliations */}
            {creator.arm_affiliations && creator.arm_affiliations.length > 0 && (
              <Card className="bg-red-950/30 border-amber-700/30 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-300">
                    <Shield className="h-5 w-5" />
                    ARM Affiliations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {creator.arm_affiliations.map((arm) => (
                      <Badge
                        key={arm}
                        className="bg-red-950/50 text-amber-300 border border-amber-700/30 px-3 py-1.5 text-sm"
                      >
                        {arm}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Guild Stats */}
            <Card className="bg-red-950/30 border-amber-700/30 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-300">
                  <Award className="h-5 w-5" />
                  Guild Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">12</p>
                    <p className="text-xs text-amber-200/60">Projects</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">47</p>
                    <p className="text-xs text-amber-200/60">Collaborations</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">8</p>
                    <p className="text-xs text-amber-200/60">Endorsements</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">156</p>
                    <p className="text-xs text-amber-200/60">Connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certification Info */}
            <Card className="bg-red-950/30 border-amber-700/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-300">
                  <Code className="h-5 w-5" />
                  Foundation Certification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-amber-200/80 mb-2">
                      This member has been certified by the AeThex Foundation and holds a verified Passport.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-amber-200/60">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Identity Verified</span>
                      <span className="text-amber-700">•</span>
                      <span>Member since {creator.created_at ? new Date(creator.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </Layout>
  );
}
