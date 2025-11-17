import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import LoadingScreen from "@/components/LoadingScreen";
import {
  ArrowRight,
  User,
  Sparkles,
  CheckCircle2,
  Shield,
} from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const navigate = useNavigate();
  const { user, profile, updateProfile, loading } = useAuth();
  const { success: toastSuccess, error: toastError } = useAethexToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      if (profile.username) {
        setUsername(profile.username);
        setUsernameAvailable(true);
      }
      if (profile.bio) setBio(profile.bio);
      if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    if (profile?.username === username) {
      setUsernameAvailable(true);
      return;
    }

    const checkUsername = async () => {
      setCheckingUsername(true);
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("username", username.toLowerCase())
          .maybeSingle();

        if (error) throw error;
        setUsernameAvailable(!data);
      } catch (error) {
        console.error("Username check error:", error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [username, profile]);

  const handleNext = async () => {
    if (step === 1) {
      if (!username || username.length < 3 || username.length > 30) {
        toastError({
          title: "Invalid username",
          description: "Username must be 3-30 characters long.",
        });
        return;
      }

      if (usernameAvailable === false) {
        toastError({
          title: "Username taken",
          description: "This username is already in use. Please choose another.",
        });
        return;
      }

      if (usernameAvailable === null) {
        toastError({
          title: "Please wait",
          description: "Checking username availability...",
        });
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      await updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl.trim() || undefined,
      });

      toastSuccess({
        title: "Passport activated!",
        description: "Welcome to the AeThex Foundation.",
      });

      navigate("/hub");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toastError({
        title: "Update failed",
        description: error?.message || "Unable to complete onboarding.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const progress = (step / 3) * 100;

  return (
    <>
      <SEO
        pageTitle="Complete Your Passport"
        description="Set up your AeThex Passport profile"
      />
      <Layout>
        <div className="min-h-screen bg-aethex-gradient py-12 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl">
              <CardHeader className="text-center space-y-4 pb-6">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-gradient-to-br from-aethex-500/30 to-neon-blue/30 border border-aethex-400/40 shadow-lg shadow-aethex-400/20">
                    <Shield className="h-8 w-8 text-aethex-300" />
                  </div>
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-aethex-300 via-neon-blue to-aethex-400 bg-clip-text text-transparent">
                    Complete Your Passport
                  </CardTitle>
                  <CardDescription className="text-base">
                    Step {step} of 3: {step === 1 ? "Username" : step === 2 ? "Profile" : "Review"}
                  </CardDescription>
                </div>
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Getting started</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Choose a username
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                          placeholder="your_username"
                          className={`pl-10 bg-background/50 border-border/50 focus:border-aethex-400 ${
                            usernameAvailable === false ? "border-red-500" : 
                            usernameAvailable === true ? "border-green-500" : ""
                          }`}
                          required
                          minLength={3}
                          maxLength={30}
                        />
                      </div>
                      {checkingUsername && (
                        <p className="text-xs text-muted-foreground">Checking availability...</p>
                      )}
                      {usernameAvailable === false && (
                        <p className="text-xs text-red-400">This username is already taken</p>
                      )}
                      {usernameAvailable === true && username.length >= 3 && (
                        <p className="text-xs text-green-400">Username available!</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Your username will be part of your Passport URL: {username || "username"}.aethex.me
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 p-4 bg-aethex-500/10 border border-aethex-400/30 rounded-lg">
                      <Sparkles className="h-5 w-5 text-aethex-300" />
                      <p className="text-sm text-muted-foreground">
                        This is your official Foundation identity. Choose wisely!
                      </p>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
                      onClick={handleNext}
                      disabled={!username || username.length < 3 || usernameAvailable !== true || checkingUsername}
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">
                        Tell us about yourself (optional)
                      </Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="I'm a developer, creator, and innovator..."
                        className="bg-background/50 border-border/50 focus:border-aethex-400 min-h-[120px]"
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {bio.length}/500 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar" className="text-sm font-medium">
                        Avatar URL (optional)
                      </Label>
                      <Input
                        id="avatar"
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.png"
                        className="bg-background/50 border-border/50 focus:border-aethex-400"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleBack}
                      >
                        Back
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
                        onClick={handleNext}
                      >
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Review Your Passport</h3>
                      
                      <div className="space-y-3 p-4 bg-background/30 rounded-lg border border-border/30">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Username</span>
                          <Badge variant="outline" className="border-aethex-400/50 text-aethex-300">
                            @{username}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Passport URL</span>
                          <span className="text-sm font-mono text-aethex-300">
                            {username}.aethex.me
                          </span>
                        </div>

                        {bio && (
                          <div className="pt-2 border-t border-border/30">
                            <p className="text-sm text-muted-foreground">Bio</p>
                            <p className="text-sm mt-1">{bio}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        <p className="text-sm text-green-300">
                          Your Passport is ready to be activated!
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleBack}
                        disabled={isLoading}
                      >
                        Back
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
                        onClick={handleComplete}
                        disabled={isLoading}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Activate Passport
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                🛡️ Foundation-verified identity • Powered by AeThex
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
