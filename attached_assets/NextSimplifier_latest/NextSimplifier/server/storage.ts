import { 
  creators, projects, projectTeamMembers,
  type Creator, type InsertCreator,
  type Project, type InsertProject, type ProjectWithTeam,
  type ProjectTeamMember, type InsertProjectTeamMember
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getCreatorBySlug(slug: string): Promise<Creator | undefined>;
  getAllCreators(): Promise<Creator[]>;
  createCreator(creator: InsertCreator): Promise<Creator>;
  
  getProjectBySlug(slug: string): Promise<ProjectWithTeam | undefined>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  addTeamMember(member: InsertProjectTeamMember): Promise<ProjectTeamMember>;
  getProjectTeamMembers(projectId: number): Promise<ProjectTeamMember[]>;
}

export class DatabaseStorage implements IStorage {
  async getCreatorBySlug(slug: string): Promise<Creator | undefined> {
    const [creator] = await db.select().from(creators).where(eq(creators.slug, slug));
    return creator || undefined;
  }

  async getAllCreators(): Promise<Creator[]> {
    return await db.select().from(creators);
  }

  async createCreator(insertCreator: InsertCreator): Promise<Creator> {
    const [creator] = await db
      .insert(creators)
      .values(insertCreator as any)
      .returning();
    return creator;
  }

  async getProjectBySlug(slug: string): Promise<ProjectWithTeam | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
    if (!project) return undefined;
    
    const teamMembers = await db
      .select()
      .from(projectTeamMembers)
      .where(eq(projectTeamMembers.projectId, project.id));
    
    return { ...project, teamMembers };
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject as any)
      .returning();
    return project;
  }

  async addTeamMember(member: InsertProjectTeamMember): Promise<ProjectTeamMember> {
    const [teamMember] = await db
      .insert(projectTeamMembers)
      .values(member)
      .returning();
    return teamMember;
  }

  async getProjectTeamMembers(projectId: number): Promise<ProjectTeamMember[]> {
    return await db
      .select()
      .from(projectTeamMembers)
      .where(eq(projectTeamMembers.projectId, projectId));
  }
}

export const storage = new DatabaseStorage();
