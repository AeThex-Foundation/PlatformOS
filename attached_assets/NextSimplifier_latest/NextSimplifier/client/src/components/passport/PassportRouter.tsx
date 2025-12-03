import { useState, useEffect } from "react";
import CreatorProfile from "./CreatorProfile";
import ProjectShowcase from "./ProjectShowcase";
import { Gamepad2, Code2, Palette, Wrench, Trophy, Zap } from "lucide-react";
import { Github, Twitter, Globe, Mail } from "lucide-react";
import maleAvatar from "@assets/generated_images/creator_profile_avatar_male.png";
import femaleAvatar from "@assets/generated_images/creator_profile_avatar_female.png";
import heroImage from "@assets/generated_images/gameforge_project_hero_image.png";

type RouteType = "creator" | "project" | "unknown";

interface PassportRouterProps {
  previewMode?: "creator" | "project";
}

export default function PassportRouter({ previewMode }: PassportRouterProps) {
  const [routeType, setRouteType] = useState<RouteType>("unknown");
  const [subdomain, setSubdomain] = useState<string>("");

  useEffect(() => {
    if (previewMode) {
      setRouteType(previewMode);
      setSubdomain(previewMode === "creator" ? "andersongladney" : "chroma-shift");
      return;
    }

    const hostname = window.location.hostname;
    
    if (hostname.endsWith(".aethex.me")) {
      const sub = hostname.replace(".aethex.me", "");
      setSubdomain(sub);
      setRouteType("creator");
    } else if (hostname.endsWith(".aethex.space")) {
      const sub = hostname.replace(".aethex.space", "");
      setSubdomain(sub);
      setRouteType("project");
    } else {
      setRouteType("unknown");
    }
  }, [previewMode]);

  if (routeType === "creator") {
    return (
      <CreatorProfile
        username={subdomain}
        displayName="Anderson Gladney"
        tagline="Full-Stack Developer & Game Creator"
        bio="Passionate about building immersive digital experiences. Leading the charge at AeThex to create tools that empower creators worldwide. When I'm not coding, you'll find me exploring new game mechanics or mentoring the next generation of developers."
        avatarUrl={maleAvatar}
        isVerified={true}
        badges={[
          { icon: Gamepad2, label: "GameForge" },
          { icon: Code2, label: "Architect" },
          { icon: Palette, label: "Designer" },
          { icon: Wrench, label: "Builder" },
          { icon: Trophy, label: "Pioneer" },
          { icon: Zap, label: "Innovator" },
        ]}
        links={[
          { icon: Github, title: "GitHub", href: "https://github.com" },
          { icon: Twitter, title: "Twitter", href: "https://twitter.com" },
          { icon: Globe, title: "Portfolio", href: "https://example.com" },
          { icon: Mail, title: "Contact", href: "mailto:hello@example.com" },
        ]}
      />
    );
  }

  if (routeType === "project") {
    return (
      <ProjectShowcase
        slug={subdomain}
        title="Chroma Shift"
        tagline="Master the art of color in this mind-bending puzzle adventure"
        description="Chroma Shift is an innovative puzzle game where you manipulate the spectrum of light to solve increasingly complex challenges. Navigate through a world where color is your greatest tool and perception is your guide."
        heroImageUrl={heroImage}
        genre="Puzzle / Adventure"
        platform="PC / Web"
        status="In Development"
        timeline="Q2 2025"
        team={[
          {
            name: "Anderson Gladney",
            role: "Lead Developer",
            avatarUrl: maleAvatar,
            profileUrl: "https://andersongladney.aethex.me",
          },
          {
            name: "Sarah Kim",
            role: "Game Designer",
            avatarUrl: femaleAvatar,
            profileUrl: "https://sarah.aethex.me",
          },
          {
            name: "Marcus Chen",
            role: "Artist",
          },
          {
            name: "Elena Rodriguez",
            role: "Sound Designer",
          },
        ]}
        features={[
          "50+ hand-crafted puzzles across 5 unique worlds",
          "Dynamic color-blending mechanics",
          "Atmospheric soundtrack that reacts to gameplay",
          "Speedrun mode with global leaderboards",
        ]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold font-display mb-4">AeThex Passport Engine</h1>
        <p className="text-muted-foreground mb-8">
          This app routes traffic for creator profiles and project showcases.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="?preview=creator"
            className="px-6 py-3 bg-neon-purple text-white rounded-lg font-medium hover-elevate"
            data-testid="button-preview-creator"
          >
            Preview Creator Profile
          </a>
          <a
            href="?preview=project"
            className="px-6 py-3 bg-gameforge-green text-gameforge-dark rounded-lg font-medium hover-elevate"
            data-testid="button-preview-project"
          >
            Preview Project Showcase
          </a>
        </div>
      </div>
    </div>
  );
}
