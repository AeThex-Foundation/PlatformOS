import { useState, useEffect } from "react";
import CreatorProfile from "./CreatorProfile";
import ProjectShowcase from "./ProjectShowcase";
import { 
  Gamepad2, Code2, Palette, Wrench, Trophy, Zap,
  Github, Twitter, Globe, Mail, Linkedin, Link as LinkIcon,
  type LucideIcon
} from "lucide-react";
import maleAvatar from "@assets/generated_images/creator_profile_avatar_male.png";
import heroImage from "@assets/generated_images/gameforge_project_hero_image.png";
import type { CreatorPassport, ProjectWithTeam } from "@/types/passport";

type RouteType = "creator" | "project" | "unknown" | "loading" | "error";

interface PassportRouterProps {
  previewMode?: "creator" | "project";
}

const iconMap: Record<string, LucideIcon> = {
  Github: Github,
  Twitter: Twitter,
  Globe: Globe,
  Mail: Mail,
  Linkedin: Linkedin,
  Link: LinkIcon,
  Gamepad2: Gamepad2,
  Code2: Code2,
  Palette: Palette,
  Wrench: Wrench,
  Trophy: Trophy,
  Zap: Zap,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name] || LinkIcon;
}

export default function PassportRouter({ previewMode }: PassportRouterProps) {
  const [routeType, setRouteType] = useState<RouteType>("unknown");
  const [subdomain, setSubdomain] = useState<string>("");
  const [creatorData, setCreatorData] = useState<CreatorPassport | null>(null);
  const [projectData, setProjectData] = useState<ProjectWithTeam | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (previewMode) {
      setRouteType(previewMode);
      setSubdomain(previewMode === "creator" ? "demo" : "demo-project");
      return;
    }

    const hostname = window.location.hostname;
    
    if (hostname.endsWith(".aethex.me")) {
      const sub = hostname.replace(".aethex.me", "");
      setSubdomain(sub);
      setRouteType("loading");
      fetchCreatorData(sub);
    } else if (hostname.endsWith(".aethex.space")) {
      const sub = hostname.replace(".aethex.space", "");
      setSubdomain(sub);
      setRouteType("loading");
      fetchProjectData(sub);
    } else {
      setRouteType("unknown");
    }
  }, [previewMode]);

  async function fetchCreatorData(slug: string) {
    try {
      const response = await fetch(`/api/passport/subdomain-data/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Creator not found");
        } else {
          setError("Failed to load profile");
        }
        setRouteType("error");
        return;
      }
      const result = await response.json();
      
      // Map the subdomain-data response to CreatorPassport format
      const user = result.user;
      const data: CreatorPassport = {
        id: 0,
        slug: user.username,
        displayName: user.full_name || user.username,
        tagline: user.active_title || user.primary_role || "AeThex Creator",
        bio: user.bio,
        avatarUrl: user.avatar_url,
        isVerified: user.is_verified || false,
        badges: (user.skills || []).slice(0, 4).map((skill: string) => ({
          icon: "Wrench",
          label: skill
        })),
        links: [
          user.github_url && { icon: "Github", title: "GitHub", href: user.github_url },
          user.twitter_url && { icon: "Twitter", title: "Twitter", href: user.twitter_url },
          user.linkedin_url && { icon: "Linkedin", title: "LinkedIn", href: user.linkedin_url },
          user.website_url && { icon: "Globe", title: "Website", href: user.website_url },
        ].filter(Boolean) as { icon: string; title: string; href: string }[],
        nexusUrl: `https://nexus.aethex.dev/${user.username}`,
        achievements: user.achievements || [],
        projects: [],
        followStats: { followers: 0, following: 0 },
        armAffiliations: user.arm_affiliations || [],
        interests: user.interests || [],
        ethosProfile: null,
      };
      
      setCreatorData(data);
      setRouteType("creator");
    } catch (err) {
      setError("Failed to load profile");
      setRouteType("error");
    }
  }

  async function fetchProjectData(slug: string) {
    try {
      const response = await fetch(`/api/passport/project-data/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Project not found");
        } else {
          setError("Failed to load project");
        }
        setRouteType("error");
        return;
      }
      const result = await response.json();
      
      // Map the project-data response to ProjectWithTeam format
      const group = result.group;
      const data: ProjectWithTeam = {
        id: 0,
        slug: group.slug || slug,
        title: group.name,
        tagline: group.description?.substring(0, 100) || "An AeThex Project",
        description: group.description || "",
        heroImageUrl: group.banner_url,
        genre: "Project",
        platform: "Web",
        status: "In Development",
        timeline: null,
        features: [],
        playUrl: group.website,
        teamMembers: (group.members || []).map((m: any, index: number) => ({
          id: index + 1,
          projectId: 0,
          creatorId: null,
          name: m.user?.full_name || m.user?.username || "Team Member",
          role: m.role || "Member",
          avatarUrl: m.user?.avatar_url || null,
          profileUrl: m.user?.username ? `https://${m.user.username}.aethex.me` : null,
        })),
      };
      
      setProjectData(data);
      setRouteType("project");
    } catch (err) {
      setError("Failed to load project");
      setRouteType("error");
    }
  }

  if (routeType === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (routeType === "error") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-white mb-4">Not Found</h1>
          <p className="text-slate-400 mb-8">{error || "The requested page could not be found."}</p>
          <a
            href="https://aethex.foundation"
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Return to AeThex
          </a>
        </div>
      </div>
    );
  }

  if (routeType === "creator") {
    if (previewMode || !creatorData) {
      return (
        <CreatorProfile
          username={subdomain}
          displayName="Demo Creator"
          tagline="Full-Stack Developer & Game Creator"
          bio="This is a demo creator profile. In production, this will display real creator data from the AeThex Passport system."
          avatarUrl={maleAvatar}
          isVerified={true}
          badges={[
            { icon: Gamepad2, label: "GameForge" },
            { icon: Code2, label: "Architect" },
            { icon: Palette, label: "Designer" },
          ]}
          links={[
            { icon: Github, title: "GitHub", href: "https://github.com" },
            { icon: Twitter, title: "Twitter", href: "https://twitter.com" },
          ]}
        />
      );
    }

    return (
      <CreatorProfile
        username={creatorData.slug}
        displayName={creatorData.displayName}
        tagline={creatorData.tagline}
        bio={creatorData.bio || undefined}
        avatarUrl={creatorData.avatarUrl || undefined}
        isVerified={creatorData.isVerified}
        badges={creatorData.badges.map(b => ({ icon: getIcon(b.icon), label: b.label }))}
        links={creatorData.links.map(l => ({ icon: getIcon(l.icon), title: l.title, href: l.href }))}
        achievements={creatorData.achievements}
        projects={creatorData.projects}
        followStats={creatorData.followStats}
        armAffiliations={creatorData.armAffiliations}
        interests={creatorData.interests}
        nexusUrl={creatorData.nexusUrl || undefined}
      />
    );
  }

  if (routeType === "project") {
    if (previewMode || !projectData) {
      return (
        <ProjectShowcase
          slug={subdomain}
          title="Demo Project"
          tagline="A demonstration of the AeThex project showcase"
          description="This is a demo project showcase. In production, this will display real project data from the AeThex ecosystem."
          heroImageUrl={heroImage}
          genre="Demo"
          platform="Web"
          status="In Development"
          timeline="Coming Soon"
          team={[
            { name: "Demo Creator", role: "Lead Developer" },
          ]}
          features={[
            "Feature-rich project showcases",
            "Team member profiles with links",
            "Beautiful GameForge-themed design",
          ]}
        />
      );
    }

    return (
      <ProjectShowcase
        slug={projectData.slug}
        title={projectData.title}
        tagline={projectData.tagline}
        description={projectData.description}
        heroImageUrl={projectData.heroImageUrl || heroImage}
        genre={projectData.genre}
        platform={projectData.platform}
        status={projectData.status}
        timeline={projectData.timeline || undefined}
        team={projectData.teamMembers.map(tm => ({
          name: tm.name,
          role: tm.role,
          avatarUrl: tm.avatarUrl || undefined,
          profileUrl: tm.profileUrl || undefined,
        }))}
        features={projectData.features}
        playUrl={projectData.playUrl || undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-white font-display mb-4">AeThex Passport Engine</h1>
        <p className="text-slate-400 mb-8">
          This app routes traffic for creator profiles and project showcases.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="?preview=creator"
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            data-testid="button-preview-creator"
          >
            Preview Creator Profile
          </a>
          <a
            href="?preview=project"
            className="px-6 py-3 bg-green-500 text-slate-900 rounded-lg font-medium hover:bg-green-400 transition-colors"
            data-testid="button-preview-project"
          >
            Preview Project Showcase
          </a>
        </div>
      </div>
    </div>
  );
}
