import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Music, Settings, Sparkles, DollarSign, Clock, 
  ExternalLink, Check, X, Plus, Loader2, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const SKILL_OPTIONS = [
  "Synthwave", "Orchestral", "Electronic", "Ambient", "Rock",
  "Hip-Hop", "SFX Design", "Game Audio", "Film Score", "Lo-Fi",
  "Chiptune", "Dubstep", "Jazz", "Classical", "Metal"
];

interface ArtistProfile {
  user_id: string;
  skills: string[];
  for_hire: boolean;
  bio: string | null;
  portfolio_url: string | null;
  sample_price_track: number | null;
  sample_price_sfx: number | null;
  sample_price_score: number | null;
  turnaround_days: number | null;
  verified: boolean;
  total_downloads: number;
}

export default function ArtistSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  
  const [skills, setSkills] = useState<string[]>([]);
  const [forHire, setForHire] = useState(true);
  const [bio, setBio] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [priceTrack, setPriceTrack] = useState("");
  const [priceSfx, setPriceSfx] = useState("");
  const [priceScore, setPriceScore] = useState("");
  const [turnaroundDays, setTurnaroundDays] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const response = await fetch("/api/ethos/my-profile", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile(data.profile);
          setSkills(data.profile.skills || []);
          setForHire(data.profile.for_hire ?? true);
          setBio(data.profile.bio || "");
          setPortfolioUrl(data.profile.portfolio_url || "");
          setPriceTrack(data.profile.sample_price_track?.toString() || "");
          setPriceSfx(data.profile.sample_price_sfx?.toString() || "");
          setPriceScore(data.profile.sample_price_score?.toString() || "");
          setTurnaroundDays(data.profile.turnaround_days?.toString() || "");
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const response = await fetch("/api/ethos/artists", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          skills,
          for_hire: forHire,
          bio: bio || null,
          portfolio_url: portfolioUrl || null,
          sample_price_track: priceTrack ? parseFloat(priceTrack) : null,
          sample_price_sfx: priceSfx ? parseFloat(priceSfx) : null,
          sample_price_score: priceScore ? parseFloat(priceScore) : null,
          turnaround_days: turnaroundDays ? parseInt(turnaroundDays) : null,
        }),
      });

      if (response.ok) {
        toast({
          title: "Profile Saved",
          description: "Your Ethos Guild profile has been updated.",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  function toggleSkill(skill: string) {
    setSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-background to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-slate-800 max-w-md">
          <CardContent className="py-12 text-center">
            <Music className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Sign In Required</h3>
            <p className="text-slate-400 mb-6">
              Sign in to manage your Ethos Guild artist profile.
            </p>
            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Link to="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-background to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-background to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-slate-400 hover:text-white mb-4">
            <Link to="/passport">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Passport Hub
            </Link>
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <Music className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Ethos Guild Settings</h1>
              <p className="text-slate-400">Manage your audio portfolio and artist profile</p>
            </div>
          </div>
          
          {profile?.verified && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mt-2">
              <Check className="w-3 h-3 mr-1" />
              Verified Artist
            </Badge>
          )}
        </div>

        <div className="grid gap-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Skills & Expertise
              </CardTitle>
              <CardDescription>
                Select the audio production skills you specialize in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                      skills.includes(skill)
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                        : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600"
                    )}
                  >
                    {skills.includes(skill) && <Check className="w-3 h-3 inline mr-1" />}
                    {skill}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Available for Hire</Label>
                  <p className="text-sm text-slate-500">Accept commission requests from clients</p>
                </div>
                <Switch 
                  checked={forHire} 
                  onCheckedChange={setForHire}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-slate-300">Artist Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell the community about your audio production journey..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="bg-slate-800/50 border-slate-700 focus:border-purple-500/50 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio" className="text-slate-300">Portfolio URL</Label>
                <Input
                  id="portfolio"
                  type="url"
                  placeholder="https://soundcloud.com/yourname"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 focus:border-purple-500/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-400" />
                Pricing (Optional)
              </CardTitle>
              <CardDescription>
                Set sample pricing for commission inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceTrack" className="text-slate-300">Custom Track</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input
                      id="priceTrack"
                      type="number"
                      placeholder="500"
                      value={priceTrack}
                      onChange={(e) => setPriceTrack(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 focus:border-purple-500/50 pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceSfx" className="text-slate-300">SFX Pack</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input
                      id="priceSfx"
                      type="number"
                      placeholder="150"
                      value={priceSfx}
                      onChange={(e) => setPriceSfx(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 focus:border-purple-500/50 pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceScore" className="text-slate-300">Full Score</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input
                      id="priceScore"
                      type="number"
                      placeholder="2000"
                      value={priceScore}
                      onChange={(e) => setPriceScore(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 focus:border-purple-500/50 pl-7"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label htmlFor="turnaround" className="text-slate-300">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Turnaround Time (days)
                </Label>
                <Input
                  id="turnaround"
                  type="number"
                  placeholder="14"
                  value={turnaroundDays}
                  onChange={(e) => setTurnaroundDays(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 focus:border-purple-500/50 max-w-32"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
            <Button asChild variant="outline" className="border-slate-700">
              <Link to="/ethos/library">
                <Music className="w-4 h-4 mr-2" />
                Manage Tracks
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
