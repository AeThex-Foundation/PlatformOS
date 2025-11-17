import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  ArrowRight,
  Shield,
  Sparkles,
  Github,
  Mail,
  Lock,
  User,
} from "lucide-react";

const DiscordIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.3671a19.8062 19.8062 0 0 0-4.8851-1.5152.074.074 0 0 0-.0784.0371c-.211.3754-.444.8635-.607 1.2491-1.798-.2704-3.5915-.2704-5.3719 0-.163-.3856-.405-.8737-.62-1.2491a.077.077 0 0 0-.0784-.037 19.7363 19.7363 0 0 0-4.888 1.5152.07.07 0 0 0-.0325.0277C1.618 8.443.134 12.4693 1.981 16.4267a.0842.0842 0 0 0 .0313.0355c1.555.8679 3.064 1.3975 4.555 1.7031a.083.083 0 0 0 .09-.0395c.23-.4354.435-.8888.607-1.3518a.083.083 0 0 0-.046-.1159c-.606-.2324-1.184-.5255-1.738-.8614a.084.084 0 0 1-.008-.1404c.117-.0877.234-.1783.346-.2716a.083.083 0 0 1 .088-.0105c3.646 1.6956 7.596 1.6956 11.182 0a.083.083 0 0 1 .088.009c.112.0933.23.1839.347.2717a.083.083 0 0 1-.006.1404c-.557.3359-1.135.6291-1.742.8615a.084.084 0 0 0-.046.1159c.173.4647.377.9189.607 1.3518a.083.083 0 0 0 .09.0395c1.494-.3066 3.003-.8352 4.555-1.7031a.083.083 0 0 0 .035-.0355c2.0037-4.0016.6248-8.0511-2.607-11.3586a.06.06 0 0 0-.031-.0277ZM8.02 13.3328c-.983 0-1.79-.9015-1.79-2.0074 0-1.1059.795-2.0074 1.79-2.0074 1.001 0 1.799.9039 1.79 2.0074 0 1.1059-.795 2.0074-1.79 2.0074Zm7.975 0c-.984 0-1.79-.9015-1.79-2.0074 0-1.1059.795-2.0074 1.79-2.0074.999 0 1.799.9039 1.789 2.0074 0 1.1059-.79 2.0074-1.789 2.0074Z" />
  </svg>
);

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const { signUp, signInWithOAuth } = useAuth();
  const { success: toastSuccess, error: toastError } = useAethexToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toastError({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical.",
      });
      return;
    }

    if (password.length < 8) {
      toastError({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, { full_name: fullName });
      toastSuccess({
        title: "Welcome to the Foundation!",
        description: "Check your email to verify your account, then sign in to complete your Passport.",
      });
      // Redirect to login page with a message to check email
      navigate("/login?verified=pending");
    } catch (error: any) {
      console.error("Signup error:", error);
      toastError({
        title: "Signup failed",
        description: error?.message || "Unable to create your account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: "github" | "google" | "discord") => {
    try {
      sessionStorage.setItem("oauth_redirect_to", "/onboarding");
      await signInWithOAuth(provider);
    } catch (error) {
      console.error("OAuth error:", error);
    }
  };

  return (
    <>
      <SEO
        pageTitle="Create Your AeThex Passport"
        description="Join the AeThex Foundation and get your official Passport"
      />
      <Layout>
        <div className="min-h-screen bg-aethex-gradient py-12 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-md">
            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-aethex-400 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl animate-scale-in relative z-10">
              <CardHeader className="text-center space-y-4 pb-6">
                <div className="flex justify-center animate-bounce-slow">
                  <div className="p-4 rounded-full bg-gradient-to-br from-aethex-500/30 to-neon-blue/30 border border-aethex-400/40 shadow-lg shadow-aethex-400/20">
                    <Shield className="h-8 w-8 text-aethex-300 animate-pulse-glow" />
                  </div>
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-aethex-300 via-neon-blue to-aethex-400 bg-clip-text text-transparent">
                    Create Your Passport
                  </CardTitle>
                  <CardDescription className="text-base">
                    Join the AeThex Foundation and get your official identity
                  </CardDescription>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="border-aethex-400/50 text-aethex-300 bg-aethex-500/10"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Official Passport
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-neon-blue/50 text-neon-blue bg-neon-blue/10"
                  >
                    Foundation Verified
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Social Signup Buttons */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Quick Sign Up
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="w-full hover-lift interactive-scale border-border/50 hover:border-aethex-400/50 hover:bg-aethex-500/10 transition-all duration-200"
                      onClick={() => handleSocialSignup("github")}
                    >
                      <Github className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">GitHub</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full hover-lift interactive-scale border-border/50 hover:border-neon-blue/50 hover:bg-neon-blue/10 transition-all duration-200"
                      onClick={() => handleSocialSignup("google")}
                    >
                      <Mail className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Google</span>
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/30"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-card/50 text-muted-foreground">
                      Or sign up with email
                    </span>
                  </div>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="pl-10 bg-background/50 border-border/50 focus:border-aethex-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10 bg-background/50 border-border/50 focus:border-aethex-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="pl-10 bg-background/50 border-border/50 focus:border-aethex-400"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="pl-10 bg-background/50 border-border/50 focus:border-aethex-400"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 hover-lift interactive-scale glow-blue"
                    disabled={!email || !password || !confirmPassword || !fullName || isLoading}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Your Passport
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Already have a Passport?{" "}
                    <Link
                      to="/login"
                      className="text-aethex-400 hover:underline font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="mt-6 text-center animate-fade-in">
              <p className="text-xs text-muted-foreground">
                🔒 Foundation-issued identity • Verified and secure
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
