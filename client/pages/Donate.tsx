import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Heart,
  Zap,
  Crown,
  Shield,
  Users,
  Code,
  Gift,
  Rocket,
  Trophy,
  Star,
  TrendingUp,
  Activity,
  Target,
  Wallet,
  CreditCard,
  Building2,
  GraduationCap,
  Sparkles,
  Check,
  Clock,
  ArrowRight,
  Share2,
  Twitter,
  Linkedin,
  Copy,
  ExternalLink,
  BadgeCheck,
  X,
  Scale,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DonationStats {
  recruits_trained: number;
  code_commits: number;
  grants_awarded: number;
  mentorship_matches: number;
  active_donors: number;
  total_raised: number;
}

interface FundingGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  description: string;
}

interface ActivityItem {
  id: string;
  type: 'donation' | 'recruit' | 'grant' | 'level_up';
  message: string;
  timestamp: string;
  avatar?: string;
}

interface LeaderboardEntry {
  id: string;
  username: string;
  display_name: string;
  tier: 'initiate' | 'architect' | 'overseer';
  total_donated: number;
  avatar_url?: string;
  is_anonymous: boolean;
}

export default function Donate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isMonthly, setIsMonthly] = useState(true);
  const [coverFees, setCoverFees] = useState(false);
  const [linkPassport, setLinkPassport] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouTier, setThankYouTier] = useState('');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'monthly' | 'alltime'>('alltime');
  const toastShownRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      const tier = params.get('tier') || 'donation';
      setThankYouTier(tier);
      setShowThankYou(true);
      navigate('/donate', { replace: true });
    } else if (params.get('canceled') === 'true') {
      toast({
        title: "Donation Canceled",
        description: "No worries! Come back when you're ready to support the mission.",
        variant: "destructive",
      });
      navigate('/donate', { replace: true });
    }
  }, [location.search, toast, navigate]);
  
  const [stats, setStats] = useState<DonationStats>({
    recruits_trained: 0,
    code_commits: 0,
    grants_awarded: 0,
    mentorship_matches: 0,
    active_donors: 0,
    total_raised: 0,
  });
  
  const [fundingGoals, setFundingGoals] = useState<FundingGoal[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, goalsRes, activityRes, leaderboardRes] = await Promise.all([
          fetch('/api/donate/stats'),
          fetch('/api/donate/funding-goals'),
          fetch('/api/donate/activity'),
          fetch(`/api/donate/leaderboard?period=${leaderboardPeriod}`),
        ]);
        
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
        if (goalsRes.ok) {
          const data = await goalsRes.json();
          setFundingGoals(data);
        }
        if (activityRes.ok) {
          const data = await activityRes.json();
          setActivityFeed(data);
        }
        if (leaderboardRes.ok) {
          const data = await leaderboardRes.json();
          setLeaderboard(data);
        }
      } catch (error) {
        console.error('Failed to load donation data:', error);
      }
      
      setTimeout(() => {
        setIsLoading(false);
        if (!toastShownRef.current) {
          toastShownRef.current = true;
        }
      }, 800);
    };
    
    loadData();
  }, [leaderboardPeriod]);

  const handleDonate = async (tier: string, amount: number, isRecurring: boolean) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to make a donation",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    const finalAmount = coverFees ? Math.ceil(amount * 1.03) : amount;
    
    try {
      const res = await fetch('/api/donate/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tier, 
          amount: finalAmount, 
          isRecurring,
          coverFees,
          linkPassport: linkPassport && user ? true : false
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          toast({
            title: "Thank You!",
            description: "Your donation has been recorded. Payment processing coming soon!",
          });
        }
      } else {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.message || "Failed to process donation",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to payment system",
        variant: "destructive",
      });
    }
  };

  const handleCryptoDonate = () => {
    toast({
      title: "Crypto Donations",
      description: "Send MATIC or ETH to our DAO treasury. Wallet address coming soon!",
    });
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'initiate': return 'bg-amber-600/50 text-amber-100';
      case 'architect': return 'bg-gray-400/50 text-gray-100';
      case 'overseer': return 'bg-amber-400/50 text-amber-900';
      default: return 'bg-gray-500/50 text-gray-100';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'initiate': return <Shield className="h-4 w-4" />;
      case 'architect': return <Code className="h-4 w-4" />;
      case 'overseer': return <Crown className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donation': return <Heart className="h-4 w-4 text-red-400" />;
      case 'recruit': return <Users className="h-4 w-4 text-green-400" />;
      case 'grant': return <Gift className="h-4 w-4 text-amber-400" />;
      case 'level_up': return <TrendingUp className="h-4 w-4 text-purple-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading Mission Control..."
        showProgress={true}
        duration={800}
        accentColor="from-red-500 to-amber-400"
        armLogo="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800"
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black py-8">
        <div className="container mx-auto px-4 max-w-7xl space-y-12">
          
          {/* Hero Section - Mission Dashboard */}
          <div className="space-y-6 animate-slide-down">
            <div className="flex items-center gap-4 flex-wrap">
              <Badge className="bg-green-600/50 text-green-100 animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                MISSION STATUS: ACTIVE
              </Badge>
              <Badge className="bg-amber-600/30 text-amber-200 border border-amber-500/40">
                <Shield className="h-3 w-3 mr-1" />
                501(c)(3) Public Charity • Tax-Deductible
              </Badge>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-400 via-amber-400 to-red-400 bg-clip-text text-transparent">
                Help Build the Digital Frontier
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                Your donation funds hands-on game development training for local talent. Every dollar trains students, awards scholarships, and launches careers in the creative industry.
              </p>
            </div>
            
            {/* Live Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/30">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.recruits_trained.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Students Trained</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/30">
                <CardContent className="p-4 text-center">
                  <Code className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.code_commits.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Code Commits</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/30">
                <CardContent className="p-4 text-center">
                  <Gift className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">${stats.grants_awarded.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Grants Awarded</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/30">
                <CardContent className="p-4 text-center">
                  <GraduationCap className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.mentorship_matches}</div>
                  <div className="text-xs text-gray-400">Mentorship Matches</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/30">
                <CardContent className="p-4 text-center">
                  <Heart className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.active_donors}</div>
                  <div className="text-xs text-gray-400">Active Donors</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-500/30">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">${stats.total_raised.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Total Raised</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Funding Goals Progress */}
            {fundingGoals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-400" />
                  Active Funding Goals
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {fundingGoals.map((goal) => (
                    <Card key={goal.id} className="bg-black/40 border-amber-500/30">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">{goal.name}</span>
                          <span className="text-amber-400 font-bold">
                            ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                          </span>
                        </div>
                        <Progress 
                          value={(goal.current / goal.target) * 100} 
                          className="h-2 bg-gray-800"
                        />
                        <p className="text-sm text-gray-400">{goal.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Donation Tiers */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Subscription Toggle & Options */}
              <div className="space-y-4 p-4 bg-black/40 rounded-lg border border-red-500/20">
                <div className="flex items-center justify-center gap-4">
                  <span className={`text-sm ${!isMonthly ? 'text-white font-semibold' : 'text-gray-400'}`}>One-Time</span>
                  <Switch
                    checked={isMonthly}
                    onCheckedChange={setIsMonthly}
                    className="data-[state=checked]:bg-red-600"
                  />
                  <span className={`text-sm ${isMonthly ? 'text-white font-semibold' : 'text-gray-400'}`}>Monthly</span>
                  {isMonthly && (
                    <Badge className="bg-green-600/50 text-green-100 text-xs">Best Value</Badge>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 pt-3 border-t border-gray-800">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="coverFees" 
                      checked={coverFees}
                      onCheckedChange={(checked) => setCoverFees(checked === true)}
                      className="border-amber-500/50 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                    <Label htmlFor="coverFees" className="text-sm text-gray-300 cursor-pointer">
                      Cover processing fees (+3%)
                    </Label>
                  </div>
                  
                  {user && (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="linkPassport" 
                        checked={linkPassport}
                        onCheckedChange={(checked) => setLinkPassport(checked === true)}
                        className="border-amber-500/50 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                      />
                      <Label htmlFor="linkPassport" className="text-sm text-gray-300 cursor-pointer flex items-center gap-1">
                        <BadgeCheck className="h-4 w-4 text-amber-400" />
                        Link donation to my Passport profile
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              {/* Gamified Tiers */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-amber-400" />
                  Join the Order
                </h2>
                <p className="text-gray-400">Choose your tier and become part of the Foundation's inner circle.</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Initiate Tier */}
                  <Card className="bg-gradient-to-br from-amber-950/30 via-black/40 to-amber-950/30 border-amber-600/40 hover:border-amber-500/60 transition-all hover:scale-[1.02]">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-8 w-8 text-amber-500" />
                        <div>
                          <CardTitle className="text-xl text-white">The Initiate</CardTitle>
                          <CardDescription className="text-amber-300">Foundation Backer</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-white">$10</span>
                        <span className="text-gray-400">/{isMonthly ? 'mo' : 'once'}</span>
                      </div>
                      <div className="text-sm text-gray-400 text-center">Funds: Scholarship Fund</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Name on Digital Wall of Honor
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Discord Role: [Foundation Backer]
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Monthly Newsletter
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Bronze Passport Badge
                        </li>
                      </ul>
                      <Button 
                        onClick={() => handleDonate('initiate', 10, isMonthly)}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                      >
                        Become an Initiate
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Architect Tier */}
                  <Card className="bg-gradient-to-br from-gray-800/40 via-black/40 to-gray-800/40 border-gray-400/40 hover:border-gray-300/60 transition-all hover:scale-[1.02] relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-red-600 text-white">Most Popular</Badge>
                    </div>
                    <CardHeader className="pb-2 pt-6">
                      <div className="flex items-center gap-2">
                        <Code className="h-8 w-8 text-gray-300" />
                        <div>
                          <CardTitle className="text-xl text-white">The Architect</CardTitle>
                          <CardDescription className="text-gray-300">Sprint Voter</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-white">$50</span>
                        <span className="text-gray-400">/{isMonthly ? 'mo' : 'once'}</span>
                      </div>
                      <div className="text-sm text-gray-400 text-center">Funds: Mentorship Program</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          All Initiate perks
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Playtest GameForge Builds
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Vote on Sprint Themes
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Silver Passport Badge
                        </li>
                      </ul>
                      <Button 
                        onClick={() => handleDonate('architect', 50, isMonthly)}
                        className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                      >
                        Become an Architect
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Overseer Tier */}
                  <Card className="bg-gradient-to-br from-amber-900/30 via-black/40 to-amber-900/30 border-amber-400/40 hover:border-amber-300/60 transition-all hover:scale-[1.02]">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Crown className="h-8 w-8 text-amber-400" />
                        <div>
                          <CardTitle className="text-xl text-white">The Overseer</CardTitle>
                          <CardDescription className="text-amber-200">Inner Circle</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-white">$250</span>
                        <span className="text-gray-400">/{isMonthly ? 'mo' : 'once'}</span>
                      </div>
                      <div className="text-sm text-gray-400 text-center">Funds: Guild Grants</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          All Architect perks
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          1-on-1 Strategy Call
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Limited Edition Hoodie
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Gold Passport Badge
                        </li>
                      </ul>
                      <Button 
                        onClick={() => handleDonate('overseer', 250, isMonthly)}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold"
                      >
                        Become an Overseer
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Fund a Mission Cards */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Target className="h-6 w-6 text-red-400" />
                  Fund a Specific Mission
                </h2>
                <p className="text-gray-400">Choose exactly where your support goes.</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-green-950/40 to-black/40 border-green-500/30 hover:border-green-400/50 transition-all cursor-pointer" onClick={() => handleDonate('equip_recruit', 25, false)}>
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-green-600/30 flex items-center justify-center mx-auto">
                        <GraduationCap className="h-6 w-6 text-green-400" />
                      </div>
                      <h3 className="font-bold text-white">Equip a Student</h3>
                      <p className="text-2xl font-bold text-green-400">$25</p>
                      <p className="text-sm text-gray-400">Funds a student's software license for a year</p>
                      <Button variant="outline" className="w-full border-green-500/50 text-green-300 hover:bg-green-500/10">
                        Fund This
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-950/40 to-black/40 border-blue-500/30 hover:border-blue-400/50 transition-all cursor-pointer" onClick={() => handleDonate('fuel_sprint', 100, false)}>
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-blue-600/30 flex items-center justify-center mx-auto">
                        <Rocket className="h-6 w-6 text-blue-400" />
                      </div>
                      <h3 className="font-bold text-white">Fuel a Sprint</h3>
                      <p className="text-2xl font-bold text-blue-400">$100</p>
                      <p className="text-sm text-gray-400">Covers server costs for a coding sprint</p>
                      <Button variant="outline" className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/10">
                        Fund This
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-950/40 to-black/40 border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer" onClick={() => handleDonate('launch_graduate', 500, false)}>
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center mx-auto">
                        <Star className="h-6 w-6 text-purple-400" />
                      </div>
                      <h3 className="font-bold text-white">Launch a Graduate</h3>
                      <p className="text-2xl font-bold text-purple-400">$500</p>
                      <p className="text-sm text-gray-400">Funds a portfolio site for a graduating member</p>
                      <Button variant="outline" className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
                        Fund This
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Corporate Sponsorship */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-amber-400" />
                  Corporate Sponsorship
                </h2>
                <p className="text-gray-400">For studios and companies looking to invest in the next generation of talent.</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-red-950/30 via-black/40 to-red-950/30 border-red-500/40">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Zap className="h-5 w-5 text-red-400" />
                        Sponsor a Sprint
                      </CardTitle>
                      <CardDescription className="text-red-200">$1,000 One-Time</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">Your company funds the prize pool for our next 2-week student coding sprint.</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Logo on the GitHub Repo
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          "Presented by [Company]" in Discord
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Social media shoutout
                        </li>
                      </ul>
                      <Button 
                        onClick={() => handleDonate('sponsor_sprint', 1000, false)}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      >
                        Sponsor a Sprint
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-950/30 via-black/40 to-amber-950/30 border-amber-500/40">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-400" />
                        Guild Patron
                      </CardTitle>
                      <CardDescription className="text-amber-200">$5,000 / Year</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">Fund the server infrastructure for an entire year and get premium access to our talent pool.</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Permanent logo on Foundation footer
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Hire top graduates fee-free
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Early access to talent pool
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          Quarterly impact reports
                        </li>
                      </ul>
                      <Button 
                        onClick={() => handleDonate('guild_patron', 5000, false)}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold"
                      >
                        Become a Guild Patron
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

            </div>

            {/* Right Column - Activity & Leaderboard */}
            <div className="space-y-6">
              
              {/* Live Activity Feed */}
              <Card className="bg-black/40 border-red-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-400 animate-pulse" />
                    War Room Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {activityFeed.length > 0 ? (
                        activityFeed.map((item) => (
                          <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                              {getActivityIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-300">{item.message}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                {item.timestamp}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Activity feed loading...</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Donor Leaderboard */}
              <Card className="bg-black/40 border-amber-500/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-400" />
                      Wall of Honor
                    </CardTitle>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant={leaderboardPeriod === 'monthly' ? 'default' : 'outline'}
                      onClick={() => setLeaderboardPeriod('monthly')}
                      className={leaderboardPeriod === 'monthly' ? 'bg-amber-600 hover:bg-amber-700' : 'border-amber-500/30 text-amber-300'}
                    >
                      Monthly
                    </Button>
                    <Button
                      size="sm"
                      variant={leaderboardPeriod === 'alltime' ? 'default' : 'outline'}
                      onClick={() => setLeaderboardPeriod('alltime')}
                      className={leaderboardPeriod === 'alltime' ? 'bg-amber-600 hover:bg-amber-700' : 'border-amber-500/30 text-amber-300'}
                    >
                      All Time
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-2">
                      {leaderboard.length > 0 ? (
                        leaderboard.map((donor, index) => (
                          <div 
                            key={donor.id} 
                            className={`flex items-center gap-3 p-3 rounded-lg ${
                              index === 0 ? 'bg-amber-500/20 border border-amber-500/40' :
                              index === 1 ? 'bg-gray-400/10 border border-gray-400/30' :
                              index === 2 ? 'bg-amber-700/10 border border-amber-700/30' :
                              'bg-white/5'
                            }`}
                          >
                            <div className="text-lg font-bold text-gray-400 w-6">
                              {index + 1}
                            </div>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={donor.avatar_url} />
                              <AvatarFallback className="bg-gray-800 text-gray-300">
                                {donor.is_anonymous ? '?' : donor.display_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white truncate">
                                  {donor.is_anonymous ? 'Anonymous' : donor.display_name}
                                </span>
                                <Badge className={`text-xs ${getTierBadgeColor(donor.tier)}`}>
                                  {getTierIcon(donor.tier)}
                                  <span className="ml-1 capitalize">{donor.tier}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400">${donor.total_donated.toLocaleString()}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Be the first to donate!</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="bg-black/40 border-gray-500/30">
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm text-gray-400 text-center">Secure payments via</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <CreditCard className="h-5 w-5" />
                      <span className="text-sm">Card</span>
                    </div>
                    <div className="h-4 w-px bg-gray-600" />
                    <button 
                      onClick={handleCryptoDonate}
                      className="flex items-center gap-2 text-gray-300 hover:text-purple-300 transition-colors"
                    >
                      <Wallet className="h-5 w-5" />
                      <span className="text-sm">Crypto</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Prefer crypto? Send MATIC or ETH to our treasury.
                  </p>
                  <div className="pt-2 border-t border-gray-700">
                    <a 
                      href="/legal/disclaimer" 
                      className="text-xs text-gray-500 hover:text-amber-400 transition-colors flex items-center justify-center gap-1"
                    >
                      <Scale className="h-3 w-3" />
                      Legal Disclaimer & Token Policy
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Thank You Modal */}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="bg-gradient-to-br from-black via-red-950/20 to-black border-amber-500/40 max-w-md">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-red-500 flex items-center justify-center">
              <Heart className="h-10 w-10 text-white fill-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Thank You, Hero!
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-base">
              Your {thankYouTier} donation makes a real difference. You're helping train the next generation of game developers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            {linkPassport && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <BadgeCheck className="h-6 w-6 text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-white">Donation Linked to Your Passport</p>
                  <p className="text-xs text-gray-400">Your support is now visible on your profile</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <p className="text-sm text-gray-400 text-center">Share your support</p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-400/50 text-blue-300 hover:bg-blue-500/10"
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("I just donated to @AeThexFoundation to help train the next generation of game developers! Join me in building the digital frontier. 🎮✨")}&url=${encodeURIComponent("https://aethex.org/donate")}`, '_blank');
                  }}
                >
                  <Twitter className="h-4 w-4 mr-1" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-600/50 text-blue-400 hover:bg-blue-600/10"
                  onClick={() => {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://aethex.org/donate")}`, '_blank');
                  }}
                >
                  <Linkedin className="h-4 w-4 mr-1" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-500/50 text-gray-300 hover:bg-gray-500/10"
                  onClick={() => {
                    navigator.clipboard.writeText("https://aethex.org/donate");
                    toast({
                      title: "Link Copied!",
                      description: "Share with friends to multiply your impact.",
                    });
                  }}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="pt-2 space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={() => window.open('https://discord.gg/aethex', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Our Discord Community
              </Button>
              <Button
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
                onClick={() => setShowThankYou(false)}
              >
                Continue Exploring
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
