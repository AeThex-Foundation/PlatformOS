import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { adminSupabase } from "./supabase";
import { emailService } from "./email";
import { randomUUID } from "crypto";
import blogIndexHandler from "../api/blog/index";
import blogSlugHandler from "../api/blog/[slug]";
import oauthRoutes from "./oauth/oauth-routes";
import passportRoutes from "./api/passport";
import discordRoutes from "./discord/discord-routes";
import creatorsRoutes from "./routes/creators-routes";
import profileRoutes from "./routes/profile-routes";
import achievementsRoutes from "./routes/achievements-routes";
import leaderboardRoutes from "./routes/leaderboard-routes";
import adminRoutes from "./routes/admin-routes";
import workshopsRoutes from "./routes/workshops-routes";
import resourcesRoutes from "./routes/resources-routes";
import bountiesRoutes from "./routes/bounties-routes";
import sessionsRoutes from "./routes/sessions-routes";
import oauthClientsRoutes from "./routes/oauth-clients-routes";
import { authMiddleware } from "./middleware/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    next();
  });

  // Authentication middleware - attaches req.user if valid session exists
  // Does NOT block requests - individual route handlers check auth as needed
  app.use(authMiddleware);

  // ============================================================
  // PUBLIC ROUTES (No Authentication Required for GET)
  // ============================================================

  app.get("/api/blog", blogIndexHandler);
  app.get("/api/blog/:slug", blogSlugHandler);

  // OAuth 2.0 Provider Endpoints (Foundation Passport SSO)
  app.use("/api/oauth", oauthRoutes);

  // Passport Public Profile Endpoint
  app.use("/api/passport", passportRoutes);

  // Creator Directory (Foundation "Hall of Fame" - Public)
  app.use("/api/creators", creatorsRoutes);

  // Leaderboard (Public)
  app.use("/api/leaderboard", leaderboardRoutes);

  // Achievements (Public read, handlers check auth for write)
  app.use("/api/achievements", achievementsRoutes);

  // Workshops (Public read, handlers check auth for register)
  app.use("/api/workshops", workshopsRoutes);

  // Resources (Public read, handlers check auth for download)
  app.use("/api/resources", resourcesRoutes);

  // Bounties (Public read, handlers check auth for apply)
  app.use("/api/bounties", bountiesRoutes);

  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { error } = await adminSupabase.from("contact_messages").insert([
        {
          name,
          email,
          message,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error saving contact message:", error);
        return res.status(500).json({ error: "Failed to save message" });
      }

      await emailService.sendEmail({
        to: process.env.CONTACT_EMAIL || "contact@aethex.dev",
        subject: `Contact Form: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Guardian's Hub API" });
  });

  // ============================================================
  // ROUTES WITH AUTH CHECKS (handlers verify req.user)
  // ============================================================

  // Discord OAuth Integration (requires auth)
  app.use("/api/discord", discordRoutes);

  // Profile Management (requires auth)
  app.use("/api/profile", profileRoutes);

  // Admin Dashboard (requires auth + admin role)
  app.use("/api/admin", adminRoutes);

  // OAuth Client Management (requires auth)
  app.use("/api/oauth-clients", oauthClientsRoutes);

  // Session Management (requires auth)
  app.use("/api/sessions", sessionsRoutes);

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, "../dist/spa");
    app.use(express.static(distPath));
    
    // SPA fallback - serve index.html for all non-API routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}

const PORT = parseInt(process.env.PORT || "5000", 10);

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createServer();
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ Guardian's Hub server running on http://0.0.0.0:${PORT}`);
  });
}
