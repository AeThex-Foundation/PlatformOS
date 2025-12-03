import type { LucideIcon } from "lucide-react";

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  xp_reward: number;
}

export interface ProjectPreview {
  id: string;
  title: string;
  status: string;
  description: string | null;
  created_at: string | null;
}

export interface Creator {
  id: number;
  slug: string;
  displayName: string;
  tagline: string;
  bio: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
  badges: { icon: string; label: string }[];
  links: { icon: string; title: string; href: string }[];
  nexusUrl: string | null;
}

export interface CreatorPassport extends Creator {
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

export interface ProjectTeamMember {
  id: number;
  projectId: number;
  creatorId: number | null;
  name: string;
  role: string;
  avatarUrl: string | null;
  profileUrl: string | null;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  heroImageUrl: string | null;
  genre: string;
  platform: string;
  status: "In Development" | "Beta" | "Released" | "Early Access";
  timeline: string | null;
  features: string[];
  playUrl: string | null;
}

export interface ProjectWithTeam extends Project {
  teamMembers: ProjectTeamMember[];
}

export interface SocialLink {
  icon: LucideIcon;
  title: string;
  href: string;
}

export interface Badge {
  icon: LucideIcon;
  label: string;
}
