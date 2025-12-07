import { Router, Request, Response } from "express";
import { adminSupabase as supabase } from "../supabase";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const socialRoutes = Router();

socialRoutes.post("/api/social/endorse", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { endorsed_id, skill } = req.body;

    if (!endorsed_id || !skill) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (userId === endorsed_id) {
      return res.status(400).json({ error: "Cannot endorse yourself" });
    }

    const endorser_id = userId;

    const { data: existing, error: checkError } = await supabase
      .from("endorsements")
      .select("id")
      .eq("endorser_id", endorser_id)
      .eq("endorsed_id", endorsed_id)
      .eq("skill", skill)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: "Already endorsed this skill" });
    }

    const { data, error } = await supabase
      .from("endorsements")
      .insert({
        endorser_id,
        endorsed_id,
        skill,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[Social] Endorse error:", error);
      return res.status(500).json({ error: "Failed to add endorsement" });
    }

    return res.json(data);
  } catch (err: any) {
    console.error("[Social] Endorse exception:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

socialRoutes.post("/api/mentorship/request", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { mentor_id, message } = req.body;

    if (!mentor_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (userId === mentor_id) {
      return res.status(400).json({ error: "Cannot message yourself" });
    }

    const mentee_id = userId;

    const { data, error } = await supabase
      .from("mentorship_requests")
      .insert({
        mentee_id,
        mentor_id,
        message: message || null,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[Social] Mentorship request error:", error);
      return res.status(500).json({ error: "Failed to send request" });
    }

    return res.json(data);
  } catch (err: any) {
    console.error("[Social] Mentorship request exception:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

socialRoutes.get("/api/mentorship/requests", async (req, res) => {
  try {
    const { user_id, role } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    let query = supabase.from("mentorship_requests").select(`
      id, mentee_id, mentor_id, message, status, created_at,
      mentee:mentee_id(username, full_name, avatar_url),
      mentor:mentor_id(username, full_name, avatar_url)
    `);

    if (role === "mentor") {
      query = query.eq("mentor_id", user_id);
    } else if (role === "mentee") {
      query = query.eq("mentee_id", user_id);
    } else {
      query = query.or(`mentee_id.eq.${user_id},mentor_id.eq.${user_id}`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("[Social] List requests error:", error);
      return res.status(500).json({ error: "Failed to fetch requests" });
    }

    return res.json(data || []);
  } catch (err: any) {
    console.error("[Social] List requests exception:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

socialRoutes.post("/api/mentorship/requests/:id/status", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Missing status" });
    }

    if (!["accepted", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const { data: existing, error: fetchError } = await supabase
      .from("mentorship_requests")
      .select("mentee_id, mentor_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (existing.mentee_id !== userId && existing.mentor_id !== userId) {
      return res.status(403).json({ error: "Not authorized to update this request" });
    }

    const { data, error } = await supabase
      .from("mentorship_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Social] Update request status error:", error);
      return res.status(500).json({ error: "Failed to update status" });
    }

    return res.json(data);
  } catch (err: any) {
    console.error("[Social] Update request status exception:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

socialRoutes.get("/api/mentors", async (req, res) => {
  try {
    const { q, expertise, available, limit } = req.query;

    let query = supabase
      .from("mentors")
      .select(`
        user_id,
        bio,
        expertise,
        hourly_rate,
        available,
        created_at,
        user_profiles:user_id(id, full_name, username, avatar_url, bio)
      `);

    if (available === "true") {
      query = query.eq("available", true);
    }

    if (expertise) {
      const expertiseArr = String(expertise).split(",").map(e => e.trim().toLowerCase());
      query = query.overlaps("expertise", expertiseArr);
    }

    const maxLimit = Math.min(Number(limit) || 30, 100);
    query = query.limit(maxLimit);

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("[Social] List mentors error:", error);
      return res.status(500).json({ error: "Failed to fetch mentors" });
    }

    let results = data || [];

    if (q) {
      const searchTerm = String(q).toLowerCase();
      results = results.filter((m: any) => {
        const profile = m.user_profiles;
        const name = (profile?.full_name || "").toLowerCase();
        const username = (profile?.username || "").toLowerCase();
        const bio = (m.bio || "").toLowerCase();
        return name.includes(searchTerm) || username.includes(searchTerm) || bio.includes(searchTerm);
      });
    }

    return res.json(results);
  } catch (err: any) {
    console.error("[Social] List mentors exception:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

socialRoutes.post("/api/mentors/apply", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { bio, expertise, hourly_rate, available } = req.body;

    if (expertise !== undefined && !Array.isArray(expertise)) {
      return res.status(400).json({ error: "expertise must be an array" });
    }

    const { data: existing } = await supabase
      .from("mentors")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      const updates: Record<string, any> = { updated_at: new Date().toISOString() };
      if (bio !== undefined) updates.bio = bio;
      if (expertise !== undefined) updates.expertise = expertise;
      if (hourly_rate !== undefined) updates.hourly_rate = hourly_rate;
      if (available !== undefined) updates.available = available;

      const { data, error } = await supabase
        .from("mentors")
        .update(updates)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("[Social] Update mentor error:", error);
        return res.status(500).json({ error: "Failed to update mentor profile" });
      }

      return res.json(data);
    } else {
      const { data, error } = await supabase
        .from("mentors")
        .insert({
          user_id: userId,
          bio: bio || null,
          expertise: expertise || [],
          hourly_rate: hourly_rate ?? null,
          available: typeof available === "boolean" ? available : true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("[Social] Create mentor error:", error);
        return res.status(500).json({ error: "Failed to create mentor profile" });
      }

      return res.json(data);
    }
  } catch (err: any) {
    console.error("[Social] Apply mentor exception:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});
