import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const creators = pgTable("creators", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  displayName: text("display_name").notNull(),
  tagline: text("tagline").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isVerified: boolean("is_verified").default(false),
  badges: jsonb("badges").$type<{ icon: string; label: string }[]>().default([]),
  links: jsonb("links").$type<{ icon: string; title: string; href: string }[]>().default([]),
  nexusUrl: text("nexus_url"),
});

export const creatorsRelations = relations(creators, ({ many }) => ({
  teamMemberships: many(projectTeamMembers),
}));

export const projects = pgTable("projects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  heroImageUrl: text("hero_image_url"),
  genre: text("genre").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull().$type<"In Development" | "Beta" | "Released" | "Early Access">(),
  timeline: text("timeline"),
  features: jsonb("features").$type<string[]>().default([]),
  playUrl: text("play_url"),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  teamMembers: many(projectTeamMembers),
}));

export const projectTeamMembers = pgTable("project_team_members", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  creatorId: integer("creator_id").references(() => creators.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  avatarUrl: text("avatar_url"),
  profileUrl: text("profile_url"),
});

export const projectTeamMembersRelations = relations(projectTeamMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectTeamMembers.projectId],
    references: [projects.id],
  }),
  creator: one(creators, {
    fields: [projectTeamMembers.creatorId],
    references: [creators.id],
  }),
}));

export const insertCreatorSchema = createInsertSchema(creators).pick({
  slug: true,
  displayName: true,
  tagline: true,
  bio: true,
  avatarUrl: true,
  isVerified: true,
  badges: true,
  links: true,
  nexusUrl: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  slug: true,
  title: true,
  tagline: true,
  description: true,
  heroImageUrl: true,
  genre: true,
  platform: true,
  status: true,
  timeline: true,
  features: true,
  playUrl: true,
});

export const insertProjectTeamMemberSchema = createInsertSchema(projectTeamMembers).pick({
  projectId: true,
  creatorId: true,
  name: true,
  role: true,
  avatarUrl: true,
  profileUrl: true,
});

export type InsertCreator = z.infer<typeof insertCreatorSchema>;
export type Creator = typeof creators.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertProjectTeamMember = z.infer<typeof insertProjectTeamMemberSchema>;
export type ProjectTeamMember = typeof projectTeamMembers.$inferSelect;

export type ProjectWithTeam = Project & {
  teamMembers: ProjectTeamMember[];
};
