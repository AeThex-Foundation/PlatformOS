/**
 * Passport Profile Page
 * Public profile page for Foundation Passport users
 * Accessible at /:username
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  MapPin, 
  Calendar, 
  Globe, 
  Github, 
  Twitter, 
  Linkedin,
  Award,
  Zap,
  ArrowLeft
} from "lucide-react";
import { LoadingScreen } from "@/components/LoadingScreen";

interface PublicPassportProfile {
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  created_at: string;
  total_xp?: number;
  level?: number;
  badge_count?: number;
  verified?: boolean;
}

export default function Passport() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicPassportProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setError("Username not provided");
      setLoading(false);
      return;
    }

    // Fetch profile from API
    fetch(`/api/passport/${username}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status === 404 ? "Profile not found" : "Failed to load profile");
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load passport:", err);
        setError(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !profile) {
    return (
      <>
        <SEO
          pageTitle="Profile Not Found"
          description="This Passport profile could not be found"
        />
        <Layout>
          <div className="min-h-screen bg-aethex-gradient py-20 flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-2xl">
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl text-center">
                <CardContent className="py-16 space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 border border-red-400/40">
                      <Shield className="h-12 w-12 text-red-300" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Profile Not Found
                    </h1>
                    <p className="text-muted-foreground">
                      {error || "This Passport does not exist"}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="border-aethex-500/50 hover:bg-aethex-500/10"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Foundation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <SEO
        pageTitle={`${profile.full_name} (@${profile.username})`}
        description={profile.bio || `${profile.full_name}'s Foundation Passport profile`}
        image={profile.avatar_url || undefined}
      />
      <Layout>
        <div className="min-h-screen bg-aethex-gradient py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header Card */}
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl mb-6">
              <CardHeader className="text-center space-y-6 pb-6">
                {/* Avatar */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="p-1 rounded-full bg-gradient-to-br from-aethex-500 via-amber-500 to-aethex-600 shadow-lg shadow-aethex-500/50">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          className="w-32 h-32 rounded-full object-cover border-4 border-background"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-aethex-500/30 to-amber-500/30 border-4 border-background flex items-center justify-center">
                          <Shield className="h-16 w-16 text-aethex-300" />
                        </div>
                      )}
                    </div>
                    {profile.verified && (
                      <div className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-500 border-2 border-background">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & Username */}
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-aethex-300 via-amber-400 to-aethex-400 bg-clip-text text-transparent">
                    {profile.full_name}
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    @{profile.username}
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline" className="border-aethex-500/50 text-aethex-300">
                      <Shield className="mr-1 h-3 w-3" />
                      Foundation Passport
                    </Badge>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-8 pt-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-aethex-300">
                      <Zap className="h-5 w-5" />
                      {profile.level || 1}
                    </div>
                    <p className="text-sm text-muted-foreground">Level</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-400">
                      {profile.total_xp || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-aethex-300">
                      <Award className="h-5 w-5" />
                      {profile.badge_count || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Badges</p>
                  </div>
                </div>
              </CardHeader>

              <Separator className="bg-border/50" />

              <CardContent className="pt-6 space-y-6">
                {/* Bio */}
                {profile.bio && (
                  <div className="text-center">
                    <p className="text-lg text-foreground/90 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* Location & Join Date */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-aethex-400" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-aethex-400" />
                    <span>Joined {joinDate}</span>
                  </div>
                </div>

                {/* Social Links */}
                {(profile.website_url || profile.github_url || profile.twitter_url || profile.linkedin_url) && (
                  <>
                    <Separator className="bg-border/50" />
                    <div className="flex flex-wrap justify-center gap-3">
                      {profile.website_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-aethex-500/50 hover:bg-aethex-500/10 hover:border-aethex-400"
                          onClick={() => window.open(profile.website_url!, "_blank")}
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          Website
                        </Button>
                      )}
                      {profile.github_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-aethex-500/50 hover:bg-aethex-500/10 hover:border-aethex-400"
                          onClick={() => window.open(profile.github_url!, "_blank")}
                        >
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </Button>
                      )}
                      {profile.twitter_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-aethex-500/50 hover:bg-aethex-500/10 hover:border-aethex-400"
                          onClick={() => window.open(profile.twitter_url!, "_blank")}
                        >
                          <Twitter className="mr-2 h-4 w-4" />
                          Twitter
                        </Button>
                      )}
                      {profile.linkedin_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-aethex-500/50 hover:bg-aethex-500/10 hover:border-aethex-400"
                          onClick={() => window.open(profile.linkedin_url!, "_blank")}
                        >
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn
                        </Button>
                      )}
                    </div>
                  </>
                )}

                {/* Footer Message */}
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Verified by the{" "}
                    <span className="text-aethex-400 font-semibold">AeThex Foundation</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Back Button */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-aethex-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Foundation
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
