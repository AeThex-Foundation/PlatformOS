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

socialRoutes.post("/api/mentorship/requests/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { actor_id, status } = req.body;

    if (!actor_id || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!["accepted", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
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
