/**
 * Projects Routes
 * API endpoints for project showcases
 * Used by *.aethex.space subdomains
 */

import { Router, Request, Response } from 'express';
import { passportStorage } from '../storage/passport-storage';

const router = Router();

/**
 * GET /api/projects
 * List all projects
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await passportStorage.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error("[Projects] Failed to fetch projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

/**
 * GET /api/projects/:slug
 * Get project by slug with team members
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const project = await passportStorage.getProjectBySlug(slug);
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    res.json(project);
  } catch (error) {
    console.error("[Projects] Failed to fetch project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

export default router;
