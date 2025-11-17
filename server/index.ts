import "dotenv/config";
import express from "express";
import cors from "cors";
import { adminSupabase } from "./supabase";
import { emailService } from "./email";
import { randomUUID } from "crypto";
import blogIndexHandler from "../api/blog/index";
import blogSlugHandler from "../api/blog/[slug]";

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

  app.get("/api/blog", blogIndexHandler);
  app.get("/api/blog/:slug", blogSlugHandler);

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

  return app;
}

const PORT = parseInt(process.env.PORT || "5000", 10);

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createServer();
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ Guardian's Hub server running on http://0.0.0.0:${PORT}`);
  });
}
