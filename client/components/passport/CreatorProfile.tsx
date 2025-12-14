import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Rocket, 
  Target, 
  ExternalLink, 
  Award, 
  Copy, 
  CheckCircle2,
  ArrowLeft,
  BadgeCheck,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Link as LinkIcon,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  xp_reward: number;
}

interface ProjectPreview {
  id: string;
  title: string;
  status: string;
  description: string | null;
  created_at: string | null;
}

interface SocialLink {
  icon: LucideIcon;
  title: string;
  href: string;
}

interface CreatorProfileProps {
  username: string;
  displayName: string;
  tagline: string;
  bio?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  badges: { icon: LucideIcon; label: string }[];
  links: SocialLink[];
  achievements?: Achievement[];
  projects?: ProjectPreview[];
  followStats?: { followers: number; following: number };
  armAffiliations?: string[];
  interests?: string[];
  nexusUrl?: string;
  className?: string;
}

const formatDate = (value?: string | null) => {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
};

const getAchievementIcon = (achievement: Achievement): string => {
  const key = String(achievement.icon || achievement.name || "").toLowerCase();
  if (/founding|founder/.test(key)) return "medal";
  if (/trophy|award|medal|badge/.test(key)) return "trophy";
  if (/welcome/.test(key)) return "party";
  if (/star/.test(key)) return "star";
  if (/rocket|launch/.test(key)) return "rocket";
  return "badge";
};

const armConfig: Record<string, { label: string; color: string }> = {
  foundation: {
    label: "Foundation",
    color: "bg-red-500/20 text-red-200 border-red-500/40",
  },
  gameforge: {
    label: "GameForge",
    color: "bg-green-500/20 text-green-200 border-green-500/40",
  },
  labs: {
    label: "Labs",
    color: "bg-yellow-500/20 text-yellow-200 border-yellow-500/40",
  },
  corp: {
    label: "Corp",
    color: "bg-blue-500/20 text-blue-200 border-blue-500/40",
  },
  devlink: {
    label: "Dev-Link",
    color: "bg-cyan-500/20 text-cyan-200 border-cyan-500/40",
  },
};

export default function CreatorProfile({
  username,
  displayName,
  tagline,
  bio,
  avatarUrl,
  isVerified = false,
  badges,
  links,
  achievements = [],
  projects = [],
  followStats = { followers: 0, following: 0 },
  armAffiliations = [],
  interests = [],
  nexusUrl,
  className,
}: CreatorProfileProps) {
  const [profileLinkCopied, setProfileLinkCopied] = useState(false);

  const profileUrl = `https://${username}.aethex.me`;

  const copyProfileLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setProfileLinkCopied(true);
    setTimeout(() => setProfileLinkCopied(false), 2000);
  };

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12", className)}>
      <a
        href="https://aethex.dev"
        className="fixed top-4 left-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors z-50"
        data-testid="link-back-aethex"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to AeThex</span>
      </a>

      <div className="container mx-auto px-4 max-w-5xl space-y-10">
        <Card className="border border-slate-800 bg-slate-900/70">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-28 h-28 ring-4 ring-red-500/30" data-testid="img-avatar">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="text-2xl font-bold bg-red-500/20 text-red-400">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h1 className="text-3xl font-bold text-white" data-testid="text-displayname">{displayName}</h1>
                  {isVerified && (
                    <BadgeCheck className="w-6 h-6 text-amber-400" data-testid="badge-verified" />
                  )}
                </div>
                <p className="text-slate-400 mb-2" data-testid="text-username">@{username}</p>
                <p className="text-amber-300 font-medium" data-testid="text-tagline">{tagline}</p>
                
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    {badges.slice(0, 6).map((badge, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-slate-800/80 text-slate-200 border-slate-700"
                        data-testid={`badge-skill-${index}`}
                      >
                        <badge.icon className="w-3 h-3 mr-1" />
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                )}

                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    {interests.slice(0, 5).map((interest, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="border-slate-700/70 text-slate-300"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {nexusUrl && (
                  <Button asChild className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700">
                    <a href={nexusUrl} data-testid="button-hire-me">
                      Hire Me
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {bio && (
          <Card className="border border-slate-800 bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg text-white">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed" data-testid="text-bio">{bio}</p>
            </CardContent>
          </Card>
        )}

        {projects.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Highlighted missions
                </h2>
                <p className="text-sm text-slate-300">
                  A snapshot of what this creator has shipped inside AeThex.
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="border border-slate-800 bg-slate-900/70"
                  data-testid={`card-project-${project.id}`}
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-white">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-slate-300">
                        {project.description || "AeThex project"}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-slate-700/70 text-slate-200"
                    >
                      {project.status?.replace("_", " ") ?? "active"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />{" "}
                      {formatDate(project.created_at)}
                    </span>
                    <Button
                      asChild
                      variant="ghost"
                      className="h-8 px-2 text-xs text-amber-300"
                    >
                      <a href={`https://${project.title.toLowerCase().replace(/\s+/g, '-')}.aethex.space`}>
                        View mission
                        <ExternalLink className="ml-1 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Achievements
              </h2>
              <p className="text-sm text-slate-300">
                Passport stamps earned across AeThex experiences.
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-amber-500/50 text-amber-200"
            >
              <Award className="mr-1 h-3 w-3" /> {achievements.length}{" "}
              badges
            </Badge>
          </div>
          {achievements.length === 0 ? (
            <Card className="border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-300">
              <Target className="mx-auto mb-3 h-8 w-8 text-amber-300" />
              No achievements yet. Complete onboarding and participate in
              missions to earn AeThex badges.
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="border border-slate-800 bg-slate-900/70"
                  data-testid={`card-achievement-${achievement.id}`}
                >
                  <CardContent className="flex h-full flex-col justify-between gap-3 p-5">
                    <div className="flex items-center gap-3 text-white">
                      <span className="text-3xl">
                        {getAchievementIcon(achievement) === "medal" && <Award className="w-8 h-8 text-yellow-500" />}
                        {getAchievementIcon(achievement) === "trophy" && <Award className="w-8 h-8 text-amber-500" />}
                        {getAchievementIcon(achievement) === "party" && <Award className="w-8 h-8 text-pink-500" />}
                        {getAchievementIcon(achievement) === "star" && <Award className="w-8 h-8 text-yellow-400" />}
                        {getAchievementIcon(achievement) === "rocket" && <Rocket className="w-8 h-8 text-blue-400" />}
                        {getAchievementIcon(achievement) === "badge" && <Award className="w-8 h-8 text-red-400" />}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-slate-300">
                          {achievement.description || "AeThex honor"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>XP Reward: {achievement.xp_reward ?? 0}</span>
                      <span className="flex items-center gap-1 text-amber-200">
                        <Rocket className="h-3.5 w-3.5" /> Passport stamped
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Separator className="border-slate-800" />

        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Stay connected
              </h2>
              <p className="text-sm text-slate-300">
                Reach out, collaborate, and shape the next AeThex release
                together.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-slate-700/70 text-slate-100"
            >
              <a
                href={`mailto:?subject=${encodeURIComponent("Collaboration invite")}&body=${encodeURIComponent(`Hi, I'd like to collaborate on a project. Check out my profile: ${profileUrl}`)}`}
              >
                Invite to collaborate
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/40 px-4 py-3">
            <span className="text-xs font-medium text-slate-400">
              Profile link:
            </span>
            <code className="flex-1 text-sm text-slate-200 break-all" data-testid="text-profile-url">
              {profileUrl}
            </code>
            <Button
              size="icon"
              variant="ghost"
              onClick={copyProfileLink}
              className="h-8 w-8"
              title={profileLinkCopied ? "Copied!" : "Copy"}
              data-testid="button-copy-link"
            >
              {profileLinkCopied ? (
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {armAffiliations.length > 0 && (
            <div className="rounded-lg border border-slate-700/70 bg-slate-900/40 p-4">
              <p className="text-xs font-medium text-slate-400 mb-2">
                Arm Affiliations
              </p>
              <div className="flex flex-wrap gap-2">
                {armAffiliations.map((arm: string) => {
                  const config = armConfig[arm] || {
                    label: arm,
                    color: "bg-slate-500/20 text-slate-200 border-slate-500/40",
                  };
                  return (
                    <Badge
                      key={arm}
                      className={`border ${config.color}`}
                      variant="outline"
                      data-testid={`badge-arm-${arm}`}
                    >
                      {config.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 text-sm text-slate-300">
            <Badge
              variant="outline"
              className="border-slate-700/70 bg-slate-900/40"
              data-testid="badge-followers"
            >
              Followers: {followStats.followers}
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-700/70 bg-slate-900/40"
              data-testid="badge-following"
            >
              Following: {followStats.following}
            </Badge>
            {links.map((link, index) => (
              <Button
                key={index}
                asChild
                variant="ghost"
                className="h-8 px-2 text-xs text-slate-200"
              >
                <a href={link.href} target="_blank" rel="noreferrer" data-testid={`link-social-${index}`}>
                  <link.icon className="h-3.5 w-3.5 mr-1" />
                  {link.title}
                  <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </a>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
