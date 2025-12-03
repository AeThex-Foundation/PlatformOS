import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, Globe, Users, Gamepad2, Sparkles, Star,
  ArrowRight, CheckCircle, Zap, Trophy, Code2
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Globe,
    title: "Personal Domain",
    description: "Get your own username.aethex.me subdomain that showcases your profile across the web.",
    color: "text-purple-400",
  },
  {
    icon: Shield,
    title: "Verified Status",
    description: "Earn verification through contributions, achievements, and community participation.",
    color: "text-amber-400",
  },
  {
    icon: Trophy,
    title: "Achievement Badges",
    description: "Collect badges for completing challenges, milestones, and special events.",
    color: "text-emerald-400",
  },
  {
    icon: Zap,
    title: "XP & Leveling",
    description: "Earn experience points and level up by contributing to the AeThex ecosystem.",
    color: "text-blue-400",
  },
  {
    icon: Users,
    title: "Social Connections",
    description: "Build your network with followers, connections, and team collaborations.",
    color: "text-pink-400",
  },
  {
    icon: Gamepad2,
    title: "Project Showcases",
    description: "Feature your projects with dedicated project-name.aethex.space pages.",
    color: "text-green-400",
  },
];

const REALMS = [
  { 
    name: "Development Forge", 
    icon: "🔧", 
    color: "from-orange-500 to-red-500",
    members: "Builders, Engineers, Architects",
  },
  { 
    name: "Strategist Nexus", 
    icon: "🧠", 
    color: "from-blue-500 to-indigo-500",
    members: "Planners, Analysts, Leaders",
  },
  { 
    name: "Innovation Commons", 
    icon: "💡", 
    color: "from-purple-500 to-pink-500",
    members: "Creators, Visionaries, Artists",
  },
  { 
    name: "Experience Hub", 
    icon: "🎮", 
    color: "from-green-500 to-emerald-500",
    members: "Players, Explorers, Testers",
  },
];

export default function PassportShowcase() {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Identity System</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">
          Your Digital Identity in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">AeThex Ecosystem</span>
        </h2>
        <p className="text-lg text-slate-400">
          The AeThex Passport is more than a profile - it's your verified identity, achievements, 
          and reputation across all AeThex properties.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <Card 
            key={feature.title} 
            className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all hover-elevate group"
          >
            <CardHeader>
              <div className={cn("w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform", feature.color)}>
                <feature.icon className="w-6 h-6" />
              </div>
              <CardTitle className="text-white">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Realm Alignments</h3>
          <p className="text-slate-400">
            Choose your path and connect with like-minded creators
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REALMS.map((realm) => (
            <div 
              key={realm.name}
              className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all text-center hover-elevate"
            >
              <div className={cn("w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center mx-auto mb-4", realm.color)}>
                <span className="text-3xl">{realm.icon}</span>
              </div>
              <h4 className="font-semibold text-white mb-1">{realm.name}</h4>
              <p className="text-sm text-slate-500">{realm.members}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <CardHeader>
            <Badge className="w-fit bg-purple-500/20 text-purple-300 border-purple-500/30 mb-2">
              <Users className="w-3 h-3 mr-1" /> Creator Passport
            </Badge>
            <CardTitle className="text-white text-2xl">username.aethex.me</CardTitle>
            <CardDescription className="text-slate-300">
              Your personal profile showcasing your skills, achievements, and projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {["Verified identity badge", "XP & level progression", "Achievement showcase", "Social links & connections", "Ethos Guild integration"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-6 bg-purple-500 hover:bg-purple-600">
              Claim Your Passport <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
          <CardHeader>
            <Badge className="w-fit bg-green-500/20 text-green-300 border-green-500/30 mb-2">
              <Gamepad2 className="w-3 h-3 mr-1" /> Project Passport
            </Badge>
            <CardTitle className="text-white text-2xl">project-name.aethex.space</CardTitle>
            <CardDescription className="text-slate-300">
              Dedicated showcase pages for your games, apps, and creative projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {["Custom project branding", "Team member profiles", "Feature highlights", "Play/Download links", "GameForge theme styling"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-6 bg-green-500 hover:bg-green-600 text-black">
              Create Project Page <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-8 border-t border-slate-800">
        <div className="inline-flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-amber-500/30">
          <Shield className="w-8 h-8 text-amber-400" />
          <div className="text-left">
            <p className="font-semibold text-white">Powered by AeThex Foundation</p>
            <p className="text-sm text-slate-400">The official identity provider for the AeThex ecosystem</p>
          </div>
        </div>
      </div>
    </div>
  );
}
