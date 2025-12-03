/**
 * Passport Storage Module
 * Handles Supabase queries for creator passports and project showcases
 */

import { supabaseAdmin } from '../oauth/oauth-service';

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

interface SupabaseProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  is_verified: boolean | null;
  social_links: Record<string, string> | null;
  skills: string[] | null;
  primary_role: string | null;
  specialization: string | null;
  active_title: string | null;
  arm_affiliations?: string[] | null;
  interests?: string[] | null;
}

interface SupabaseProject {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  github_url: string | null;
  live_url: string | null;
  engine: string | null;
  technologies: string[] | null;
  owner_id: string;
}

function mapProfileToCreator(profile: SupabaseProfile): Creator {
  const badges: { icon: string; label: string }[] = [];
  
  if (profile.primary_role) {
    badges.push({ icon: "Code2", label: profile.primary_role });
  }
  if (profile.specialization) {
    badges.push({ icon: "Palette", label: profile.specialization });
  }
  if (profile.skills && profile.skills.length > 0) {
    profile.skills.slice(0, 4).forEach(skill => {
      badges.push({ icon: "Wrench", label: skill });
    });
  }
  
  const links: { icon: string; title: string; href: string }[] = [];
  
  if (profile.github_url) {
    links.push({ icon: "Github", title: "GitHub", href: profile.github_url });
  }
  if (profile.twitter_url) {
    links.push({ icon: "Twitter", title: "Twitter", href: profile.twitter_url });
  }
  if (profile.linkedin_url) {
    links.push({ icon: "Linkedin", title: "LinkedIn", href: profile.linkedin_url });
  }
  if (profile.website_url) {
    links.push({ icon: "Globe", title: "Website", href: profile.website_url });
  }
  
  if (profile.social_links) {
    Object.entries(profile.social_links).forEach(([key, value]) => {
      if (value && !links.find(l => l.href === value)) {
        links.push({ icon: "Link", title: key, href: value });
      }
    });
  }

  return {
    id: 0,
    slug: profile.username,
    displayName: profile.full_name || profile.username,
    tagline: profile.active_title || profile.primary_role || "AeThex Creator",
    bio: profile.bio,
    avatarUrl: profile.avatar_url,
    isVerified: profile.is_verified || false,
    badges,
    links,
    nexusUrl: `https://nexus.aethex.dev/${profile.username}`,
  };
}

function mapSupabaseProjectToProject(proj: SupabaseProject): Project {
  const statusMap: Record<string, "In Development" | "Beta" | "Released" | "Early Access"> = {
    'planning': 'In Development',
    'in_progress': 'In Development',
    'completed': 'Released',
    'on_hold': 'In Development',
  };

  return {
    id: 0,
    slug: proj.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    title: proj.title,
    tagline: proj.description?.substring(0, 100) || "An AeThex Project",
    description: proj.description || "",
    heroImageUrl: null,
    genre: proj.engine || "Game",
    platform: "PC / Web",
    status: statusMap[proj.status || 'planning'] || 'In Development',
    timeline: null,
    features: proj.technologies || [],
    playUrl: proj.live_url,
  };
}

export class PassportStorage {
  async getCreatorBySlug(slug: string): Promise<Creator | undefined> {
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('username', slug)
      .single();

    if (error || !profile) {
      return undefined;
    }

    return mapProfileToCreator(profile as SupabaseProfile);
  }

  async getAllCreators(): Promise<Creator[]> {
    const { data: profiles, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('is_verified', true)
      .limit(50);

    if (error || !profiles) {
      return [];
    }

    return profiles.map((p: any) => mapProfileToCreator(p as SupabaseProfile));
  }

  async getCreatorPassport(slug: string): Promise<CreatorPassport | undefined> {
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('username', slug)
      .single();

    if (error || !profile) {
      return undefined;
    }

    return this.buildCreatorPassport(profile as SupabaseProfile);
  }

  private async buildCreatorPassport(profile: SupabaseProfile): Promise<CreatorPassport> {
    const baseCreator = mapProfileToCreator(profile);
    
    const [achievementsResult, projectsResult, followingResult, followersResult, ethosResult] = await Promise.all([
      supabaseAdmin
        .from('user_achievements')
        .select(`
          achievement_id,
          achievements (
            id,
            name,
            description,
            icon,
            xp_reward
          )
        `)
        .eq('user_id', profile.id),
      
      supabaseAdmin
        .from('projects')
        .select('id, title, status, description, created_at')
        .eq('owner_id', profile.id)
        .limit(4),
      
      supabaseAdmin
        .from('user_connections')
        .select('id')
        .eq('user_id', profile.id),
      
      supabaseAdmin
        .from('user_connections')
        .select('id')
        .eq('connection_id', profile.id),
      
      supabaseAdmin
        .from('creators')
        .select('verified, for_hire')
        .eq('user_id', profile.id)
        .single()
    ]);

    const achievements: Achievement[] = (achievementsResult.data || []).map((ua: any) => ({
      id: ua.achievements?.id || ua.achievement_id,
      name: ua.achievements?.name || 'Achievement',
      description: ua.achievements?.description || null,
      icon: ua.achievements?.icon || null,
      xp_reward: ua.achievements?.xp_reward || 0,
    }));

    const projects: ProjectPreview[] = (projectsResult.data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      status: p.status || 'active',
      description: p.description,
      created_at: p.created_at,
    }));

    const armAffiliations: string[] = profile.arm_affiliations || [];
    const interests: string[] = profile.interests || [];

    const ethosProfile = ethosResult.data ? {
      verified: ethosResult.data.verified || false,
      skills: profile.skills || [],
      for_hire: ethosResult.data.for_hire || false,
    } : null;

    return {
      ...baseCreator,
      achievements,
      projects,
      followStats: {
        followers: followersResult.data?.length || 0,
        following: followingResult.data?.length || 0,
      },
      armAffiliations,
      interests,
      ethosProfile,
    };
  }

  async getProjectBySlug(slug: string): Promise<ProjectWithTeam | undefined> {
    const searchSlug = slug.toLowerCase();
    
    const { data: projects, error } = await supabaseAdmin
      .from('projects')
      .select('*');

    if (error || !projects || projects.length === 0) {
      return undefined;
    }

    const project = projects.find((p: SupabaseProject) => 
      p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === searchSlug
    );

    if (!project) {
      return undefined;
    }

    const { data: teamMembers } = await supabaseAdmin
      .from('project_team_members')
      .select(`
        *,
        user_profiles:user_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('project_id', project.id);

    const mappedProject = mapSupabaseProjectToProject(project);
    
    const mappedTeamMembers: ProjectTeamMember[] = (teamMembers || []).map((tm: any, index: number) => ({
      id: index + 1,
      projectId: 0,
      creatorId: null,
      name: tm.user_profiles?.full_name || tm.user_profiles?.username || "Team Member",
      role: tm.role || "Member",
      avatarUrl: tm.user_profiles?.avatar_url || null,
      profileUrl: tm.user_profiles?.username ? `https://${tm.user_profiles.username}.aethex.me` : null,
    }));

    return {
      ...mappedProject,
      teamMembers: mappedTeamMembers,
    };
  }

  async getAllProjects(): Promise<Project[]> {
    const { data: projects, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .limit(50);

    if (error || !projects) {
      return [];
    }

    return projects.map((p: any) => mapSupabaseProjectToProject(p as SupabaseProject));
  }
}

export const passportStorage = new PassportStorage();
