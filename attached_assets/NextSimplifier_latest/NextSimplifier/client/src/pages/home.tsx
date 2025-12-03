import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DemoLanding from "@/components/passport/DemoLanding";
import CreatorProfile from "@/components/passport/CreatorProfile";
import ProjectShowcase from "@/components/passport/ProjectShowcase";
import ClaimPassport from "@/components/passport/ClaimPassport";
import { Gamepad2, Code2, Palette, Wrench, Trophy, Zap, LucideIcon, Linkedin, Link as LinkIcon } from "lucide-react";
import { Github, Twitter, Globe, Mail } from "lucide-react";
import type { Creator, ProjectWithTeam } from "@shared/schema";

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

interface CreatorPassport extends Creator {
  achievements: Achievement[];
  projects: ProjectPreview[];
  followStats: { followers: number; following: number };
  armAffiliations: string[];
  interests: string[];
  ethosProfile: {
    verified: boolean;
    skills: string[];
    for_hire: boolean;
  } | null;
}

const iconMap: Record<string, LucideIcon> = {
  Gamepad2,
  Code2,
  Palette,
  Wrench,
  Trophy,
  Zap,
  Github,
  Twitter,
  Globe,
  Mail,
  Linkedin,
  Link: LinkIcon,
};

type ViewMode = "landing" | "creator" | "project";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("landing");
  const [creatorSlug, setCreatorSlug] = useState<string>("");
  const [projectSlug, setProjectSlug] = useState<string>("");

  const { data: creator, isLoading: isLoadingCreator, isError: isCreatorError } = useQuery<CreatorPassport>({
    queryKey: ["/api/passport", creatorSlug],
    enabled: viewMode === "creator" && creatorSlug !== "",
  });

  const { data: project, isLoading: isLoadingProject, isError: isProjectError } = useQuery<ProjectWithTeam>({
    queryKey: ["/api/projects", projectSlug],
    enabled: viewMode === "project" && projectSlug !== "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preview = params.get("preview");
    const slugParam = params.get("slug");
    
    if (preview === "creator") {
      if (slugParam) setCreatorSlug(slugParam);
      setViewMode("creator");
      document.documentElement.classList.add("dark");
    } else if (preview === "project") {
      if (slugParam) setProjectSlug(slugParam);
      setViewMode("project");
    }

    const hostname = window.location.hostname;
    if (hostname.endsWith(".aethex.me")) {
      const slug = hostname.replace(".aethex.me", "");
      setCreatorSlug(slug);
      setViewMode("creator");
      document.documentElement.classList.add("dark");
    } else if (hostname.endsWith(".aethex.space")) {
      const slug = hostname.replace(".aethex.space", "");
      setProjectSlug(slug);
      setViewMode("project");
    }
  }, []);

  const handleSelectMode = (mode: "creator" | "project") => {
    setViewMode(mode);
    if (mode === "creator") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.history.pushState({}, "", `?preview=${mode}`);
  };

  if (viewMode === "creator") {
    if (!creatorSlug) {
      return <ClaimPassport slug="username" type="creator" />;
    }
    
    if (isLoadingCreator) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center dark">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      );
    }

    if (isCreatorError || !creator) {
      return <ClaimPassport slug={creatorSlug} type="creator" />;
    }

    const badges = (creator.badges as { icon: string; label: string }[] || []).map(b => ({
      icon: iconMap[b.icon] || Gamepad2,
      label: b.label,
    }));

    const links = (creator.links as { icon: string; title: string; href: string }[] || []).map(l => ({
      icon: iconMap[l.icon] || Globe,
      title: l.title,
      href: l.href,
    }));

    return (
      <CreatorProfile
        username={creator.slug}
        displayName={creator.displayName}
        tagline={creator.tagline}
        bio={creator.bio || undefined}
        avatarUrl={creator.avatarUrl || undefined}
        isVerified={creator.isVerified || false}
        badges={badges}
        links={links}
        achievements={creator.achievements || []}
        projects={creator.projects || []}
        followStats={creator.followStats || { followers: 0, following: 0 }}
        armAffiliations={creator.armAffiliations || []}
        interests={creator.interests || []}
        nexusUrl={creator.nexusUrl || undefined}
      />
    );
  }

  if (viewMode === "project") {
    if (!projectSlug) {
      return <ClaimPassport slug="project-name" type="project" />;
    }
    
    if (isLoadingProject) {
      return (
        <div className="min-h-screen bg-gameforge-dark flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gameforge-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading project...</p>
          </div>
        </div>
      );
    }

    if (isProjectError || !project) {
      return <ClaimPassport slug={projectSlug} type="project" />;
    }

    return (
      <ProjectShowcase
        slug={project.slug}
        title={project.title}
        tagline={project.tagline}
        description={project.description}
        heroImageUrl={project.heroImageUrl || ""}
        genre={project.genre}
        platform={project.platform}
        status={project.status as "In Development" | "Beta" | "Released" | "Early Access"}
        timeline={project.timeline || undefined}
        team={project.teamMembers.map(m => ({
          name: m.name,
          role: m.role,
          avatarUrl: m.avatarUrl || undefined,
          profileUrl: m.profileUrl || undefined,
        }))}
        features={(project.features as string[]) || []}
        playUrl={project.playUrl || undefined}
      />
    );
  }

  return <DemoLanding onSelectMode={handleSelectMode} />;
}
