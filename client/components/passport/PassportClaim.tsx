import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sparkles, Shield, Globe, ExternalLink, Check, 
  User, Palette, Zap, ArrowRight, Loader2, Lock, Music
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const REALMS = [
  { id: "Development Forge", icon: "🔧", color: "from-orange-500 to-red-500", description: "Builders & Engineers" },
  { id: "Strategist Nexus", icon: "🧠", color: "from-blue-500 to-indigo-500", description: "Planners & Analysts" },
  { id: "Innovation Commons", icon: "💡", color: "from-purple-500 to-pink-500", description: "Creators & Visionaries" },
  { id: "Experience Hub", icon: "🎮", color: "from-green-500 to-emerald-500", description: "Players & Explorers" },
];

export default function PassportClaim() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const extProfile = profile as any;
  const [activeTitle, setActiveTitle] = useState(extProfile?.primary_role || "");
  const [selectedRealm, setSelectedRealm] = useState(extProfile?.user_type || "");
  const [bio, setBio] = useState(profile?.bio || "");

  useEffect(() => {
    if (profile) {
      const ext = profile as any;
      setActiveTitle(ext.primary_role || "");
      setSelectedRealm(ext.user_type || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="py-12 text-center">
            <Lock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Sign In Required</h3>
            <p className="text-slate-400 mb-6">
              You need to be signed in to claim and customize your AeThex Passport.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600">
                <a href="/login">Sign In</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/signup">Create Account</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function handleSave() {
    setLoading(true);
    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          active_title: activeTitle,
          realm_alignment: selectedRealm,
          bio,
        }),
      });

      if (response.ok) {
        await refreshProfile?.();
        toast({
          title: "Passport Updated",
          description: "Your passport profile has been saved successfully.",
        });
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your passport. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const passportUrl = `https://${profile?.username || "you"}.aethex.me`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Customize Your Identity</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Claim Your Passport</h2>
        <p className="text-slate-400">
          Personalize your AeThex Passport profile that represents you across the ecosystem.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Your Passport Domain
              </CardTitle>
              <CardDescription>
                Your unique AeThex identity URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Globe className="w-5 h-5 text-purple-400" />
                <code className="text-purple-300 font-mono flex-1">{passportUrl}</code>
                <a 
                  href={passportUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-purple-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              {extProfile?.is_verified && (
                <div className="flex items-center gap-2 mt-3 text-sm text-amber-400">
                  <Shield className="w-4 h-4" />
                  <span>Verified Passport Holder</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-400" />
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">Active Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Full-Stack Developer, Game Designer"
                  value={activeTitle}
                  onChange={(e) => setActiveTitle(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 focus:border-purple-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-slate-300">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell the community about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="bg-slate-800/50 border-slate-700 focus:border-purple-500/50 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                Realm Alignment
              </CardTitle>
              <CardDescription>
                Choose the realm that best represents your focus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {REALMS.map((realm) => (
                  <button
                    key={realm.id}
                    onClick={() => setSelectedRealm(realm.id)}
                    className={cn(
                      "p-4 rounded-lg border-2 text-left transition-all hover-elevate",
                      selectedRealm === realm.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{realm.icon}</span>
                      {selectedRealm === realm.id && (
                        <Check className="w-4 h-4 text-purple-400 ml-auto" />
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-white">{realm.id}</h4>
                    <p className="text-xs text-slate-500">{realm.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-400" />
                Ethos Guild
              </CardTitle>
              <CardDescription>
                Manage your audio portfolio and music production profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">
                Join the Ethos Guild to showcase your audio production skills, share tracks, 
                and connect with projects looking for music and sound design.
              </p>
              <div className="flex gap-3">
                <Button asChild variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                  <Link to="/ethos/settings">
                    <Music className="w-4 h-4 mr-2" />
                    Artist Settings
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-700">
                  <Link to="/ethos/library">
                    Track Library
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save Passport <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <div>
          <div className="sticky top-24">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Preview</h3>
            <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700 overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20" />
              <CardContent className="pt-0 -mt-10">
                <Avatar className="w-20 h-20 border-4 border-slate-900 mb-4">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                    {(profile?.username || "U").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">
                    {profile?.full_name || profile?.username || "Your Name"}
                  </h3>
                  {extProfile?.is_verified && <Shield className="w-5 h-5 text-amber-400" />}
                </div>
                <p className="text-slate-400 text-sm mb-3">@{profile?.username || "username"}</p>
                {activeTitle && (
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-3">
                    {activeTitle}
                  </Badge>
                )}
                {bio && <p className="text-slate-300 text-sm mb-4">{bio}</p>}
                {selectedRealm && (
                  <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-lg">
                      {REALMS.find(r => r.id === selectedRealm)?.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{selectedRealm}</p>
                      <p className="text-xs text-slate-500">Realm Alignment</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{extProfile?.level || 1}</p>
                    <p className="text-xs text-slate-500">Level</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{(extProfile?.total_xp || 0).toLocaleString()}</p>
                    <p className="text-xs text-slate-500">XP</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">0</p>
                    <p className="text-xs text-slate-500">Badges</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
