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
import { authMiddleware } from "./middleware/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Authentication middleware - validates Supabase sessions
  app.use(authMiddleware);

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

  app.get("/api/blog", blogIndexHandler);
  app.get("/api/blog/:slug", blogSlugHandler);

  // OAuth 2.0 Provider Endpoints (Foundation Passport SSO)
  app.use("/api/oauth", oauthRoutes);

  // Passport Public Profile Endpoint
  app.use("/api/passport", passportRoutes);

  // Discord OAuth Integration
  app.use("/api/discord", discordRoutes);

  // Creator Directory (Foundation "Hall of Fame")
  app.use("/api/creators", creatorsRoutes);

  // Profile Management
  app.use("/api/profile", profileRoutes);

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
