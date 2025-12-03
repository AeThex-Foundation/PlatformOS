/**
 * Passport Routes
 * API endpoints for creator passports and project showcases
 * Used by *.aethex.me and *.aethex.space subdomains
 */

import { Router, Request, Response } from 'express';
import { passportStorage } from '../storage/passport-storage';

const router = Router();

/**
 * GET /api/passport/:slug
 * Get creator passport by username slug
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const passport = await passportStorage.getCreatorPassport(slug);
    
    if (!passport) {
      return res.status(404).json({ error: "Creator not found", type: "creator" });
    }
    
    res.json(passport);
  } catch (error) {
    console.error("[Passport] Failed to fetch passport:", error);
    res.status(500).json({ error: "Failed to fetch passport" });
  }
});

/**
 * GET /api/passport
 * Auto-detect route type based on host header
 * Returns creator data for *.aethex.me, project data for *.aethex.space
 */
router.get('/', async (req: Request, res: Response) => {
  const rawHost = req.headers.host || "";
  const host = rawHost.split(":")[0].toLowerCase();
  
  if (host.endsWith(".aethex.me")) {
    const slug = host.replace(".aethex.me", "");
    if (!slug || slug.includes(".")) {
      return res.status(400).json({ error: "Invalid subdomain", type: "creator" });
    }
    const creator = await passportStorage.getCreatorBySlug(slug);
    if (creator) {
      return res.json({ type: "creator", data: creator });
    }
    return res.status(404).json({ error: "Creator not found", type: "creator", slug });
  }
  
  if (host.endsWith(".aethex.space")) {
    const slug = host.replace(".aethex.space", "");
    if (!slug || slug.includes(".")) {
      return res.status(400).json({ error: "Invalid subdomain", type: "project" });
    }
    const project = await passportStorage.getProjectBySlug(slug);
    if (project) {
      return res.json({ type: "project", data: project });
    }
    return res.status(404).json({ error: "Project not found", type: "project", slug });
  }
  
  res.json({ type: "landing", message: "AeThex Passport Engine" });
});

export default router;
