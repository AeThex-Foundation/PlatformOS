import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import type { AethexUserProfile } from "@/lib/aethex-database-adapter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarClock, Edit, MapPin, Rocket, Shield, Trophy, UserCircle, Globe, Github, Linkedin, Twitter } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ProfileView = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user, profile: currentUserProfile, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<AethexUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = username === "me" || username === currentUserProfile?.username;

  useEffect(() => {
    const loadProfile = async () => {
      // Wait for auth to finish loading before checking
      if (authLoading) {
        return;
      }

      // If "me", check authentication
      if (username === "me") {
        if (!user) {
          // Not authenticated - redirect will be handled in render
          setLoading(false);
          return;
        }
        
        // User is authenticated, wait for their profile to load
        if (currentUserProfile) {
          setProfile(currentUserProfile);
          setLoading(false);
        } else {
          // Keep loading until currentUserProfile is available
          setLoading(true);
        }
        return;
      }

      // Load other user's profile by username
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("username", username)
          .single();

        if (fetchError || !data) {
          setError("Profile not found");
          setLoading(false);
          return;
        }

        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, user, currentUserProfile, navigate, authLoading]);

  // Show loading while auth is initializing OR while profile is loading
  if (authLoading || loading) {
    return <LoadingScreen message="Loading profile..." showProgress />;
  }

  // Debug logging
  console.log("ProfileView render:", { username, user: !!user, profile: !!profile, currentUserProfile: !!currentUserProfile, error, authLoading, loading });

  // If trying to access /profile/me without auth, redirect to login (must check before error/profile checks)
  if (username === "me" && !user) {
    console.log("Redirecting to login...");
    window.location.href = "/login";
    return <LoadingScreen message="Redirecting to login..." showProgress />;
  }

  // Only show error if NOT trying to access /profile/me without auth
  if (error || (!profile && username !== "me")) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Profile Not Found</CardTitle>
              <CardDescription>{error || "This profile does not exist."}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const socialLinks = [
    { label: "GitHub", url: profile.github_url, icon: Github },
    { label: "LinkedIn", url: profile.linkedin_url, icon: Linkedin },
    { label: "Twitter", url: profile.twitter_url, icon: Twitter },
    { label: "Portfolio", url: profile.website_url, icon: Globe },
  ].filter((link) => link.url);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background py-16">
        <div className="container mx-auto max-w-6xl px-4 space-y-8">
          {/* Profile Header */}
          <Card className="border-border/40">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <Avatar className="h-32 w-32 border-2 border-primary/20">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-3xl">
                    {(profile.full_name || profile.username)
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                {/* Profile Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">{profile.full_name || profile.username}</h1>
                    <p className="text-muted-foreground">@{profile.username}</p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {profile.user_type && (
                      <Badge variant="outline" className="capitalize">
                        {profile.user_type.replace(/_/g, " ")}
                      </Badge>
                    )}
                    {profile.experience_level && (
                      <Badge variant="secondary" className="capitalize">
                        {profile.experience_level}
                      </Badge>
                    )}
                    {profile.location && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {profile.location}
                      </Badge>
                    )}
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                  )}

                  {/* Social Links */}
                  {socialLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {socialLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Button
                            key={link.label}
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            <a href={link.url!} target="_blank" rel="noopener noreferrer">
                              <Icon className="h-4 w-4" />
                              {link.label}
                            </a>
                          </Button>
                        );
                      })}
                    </div>
                  )}

                  {/* Edit Button (Own Profile Only) */}
                  {isOwnProfile && (
                    <Button asChild className="gap-2">
                      <Link to="/profile/edit">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="text-2xl font-bold">Lv {profile.level || 1}</p>
                  </div>
                  <Shield className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold">{(profile.total_xp || 0).toLocaleString()}</p>
                  </div>
                  <Rocket className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="text-2xl font-bold">{profile.current_streak || 0} days</p>
                  </div>
                  <CalendarClock className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Trophy className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills & Languages */}
          {((profile.skills_detailed && (profile.skills_detailed as any[]).length > 0) ||
            (profile.languages && (profile.languages as any[]).length > 0)) && (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Languages</CardTitle>
                <CardDescription>Technical expertise and languages spoken</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.skills_detailed && (profile.skills_detailed as any[]).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Technical Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {(profile.skills_detailed as any[]).map((skill: any, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {skill.name}{" "}
                          <span className="text-xs ml-1 opacity-70">• {skill.level}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profile.languages && (profile.languages as any[]).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {(profile.languages as any[]).map((lang: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Work Experience */}
          {profile.work_experience && (profile.work_experience as any[]).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>Professional background and experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(profile.work_experience as any[]).map((exp: any, idx: number) => (
                  <div key={idx} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{exp.title}</p>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{exp.duration}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Portfolio */}
          {profile.portfolio_items && (profile.portfolio_items as any[]).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Featured projects and work samples</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(profile.portfolio_items as any[]).map((item: any, idx: number) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border p-4 transition hover:bg-accent"
                  >
                    <p className="font-medium">{item.title}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 break-all">{item.url}</p>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfileView;
