import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabaseStorage } from "./supabaseStorage";
import { insertCreatorSchema, insertProjectSchema, insertProjectTeamMemberSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/creators", async (req, res) => {
    try {
      const creators = await supabaseStorage.getAllCreators();
      res.json(creators);
    } catch (error) {
      console.error("Failed to fetch creators:", error);
      res.status(500).json({ error: "Failed to fetch creators" });
    }
  });

  app.get("/api/creators/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const full = req.query.full === 'true';
      
      if (full) {
        const passport = await supabaseStorage.getCreatorPassport(slug);
        if (!passport) {
          return res.status(404).json({ error: "Creator not found" });
        }
        return res.json(passport);
      }
      
      const creator = await supabaseStorage.getCreatorBySlug(slug);
      if (!creator) {
        return res.status(404).json({ error: "Creator not found" });
      }
      res.json(creator);
    } catch (error) {
      console.error("Failed to fetch creator:", error);
      res.status(500).json({ error: "Failed to fetch creator" });
    }
  });

  app.get("/api/passport/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const passport = await supabaseStorage.getCreatorPassport(slug);
      if (!passport) {
        return res.status(404).json({ error: "Creator not found" });
      }
      res.json(passport);
    } catch (error) {
      console.error("Failed to fetch passport:", error);
      res.status(500).json({ error: "Failed to fetch passport" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await supabaseStorage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const project = await supabaseStorage.getProjectBySlug(slug);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Failed to fetch project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.get("/api/passport", async (req, res) => {
    const rawHost = req.headers.host || "";
    const host = rawHost.split(":")[0].toLowerCase();
    
    if (host.endsWith(".aethex.me")) {
      const slug = host.replace(".aethex.me", "");
      if (!slug || slug.includes(".")) {
        return res.status(400).json({ error: "Invalid subdomain", type: "creator" });
      }
      const creator = await supabaseStorage.getCreatorBySlug(slug);
      if (creator) {
        return res.json({ type: "creator", data: creator });
      }
      return res.status(404).json({ error: "Creator not found", type: "creator" });
    }
    
    if (host.endsWith(".aethex.space")) {
      const slug = host.replace(".aethex.space", "");
      if (!slug || slug.includes(".")) {
        return res.status(400).json({ error: "Invalid subdomain", type: "project" });
      }
      const project = await supabaseStorage.getProjectBySlug(slug);
      if (project) {
        return res.json({ type: "project", data: project });
      }
      return res.status(404).json({ error: "Project not found", type: "project" });
    }
    
    res.json({ type: "landing", message: "AeThex Passport Engine" });
  });

  return httpServer;
}
