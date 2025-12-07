import { Router, Request, Response } from "express";
import { adminSupabase as supabase } from "../supabase";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const opportunitiesRoutes = Router();

opportunitiesRoutes.get("/api/opportunities", async (req, res) => {
  try {
    const { arm, type, search, page, limit, sort } = req.query;

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit)) || 12));
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from("opportunities")
      .select("*", { count: "exact" });

    if (arm) {
      query = query.eq("arm", arm);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (search) {
      const searchTerm = `%${String(search)}%`;
      query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm},company.ilike.${searchTerm}`);
    }

    if (sort === "recent") {
      query = query.order("created_at", { ascending: false });
    } else if (sort === "deadline") {
      query = query.order("deadline", { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("[Opportunities] List error:", error);
      return res.status(500).json({ error: "Failed to fetch opportunities" });
    }

    const total = count || 0;
    const pages = Math.ceil(total / limitNum);

    return res.json({
      data: data || [],
      pagination: {
        page: pageNum,
        pages,
        total,
        limit: limitNum,
      },
    });
  } catch (err: any) {
    console.error("[Opportunities] List exception:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

opportunitiesRoutes.get("/api/opportunities/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

    return res.json(data);
  } catch (err: any) {
    console.error("[Opportunities] Get exception:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

opportunitiesRoutes.post("/api/opportunities", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { title, description, company, location, type, arm, salary_range, requirements, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const { data, error } = await supabase
      .from("opportunities")
      .insert({
        title,
        description: description || null,
        company: company || null,
        location: location || null,
        type: type || "full-time",
        arm: arm || null,
        salary_range: salary_range || null,
        requirements: requirements || [],
        deadline: deadline || null,
        posted_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[Opportunities] Create error:", error);
      return res.status(500).json({ error: "Failed to create opportunity" });
    }

    return res.status(201).json(data);
  } catch (err: any) {
    console.error("[Opportunities] Create exception:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

opportunitiesRoutes.put("/api/opportunities/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { id } = req.params;
    const { title, description, company, location, type, arm, salary_range, requirements, deadline } = req.body;

    if (requirements !== undefined && !Array.isArray(requirements)) {
      return res.status(400).json({ error: "requirements must be an array" });
    }

    const { data: existing, error: checkError } = await supabase
      .from("opportunities")
      .select("posted_by")
      .eq("id", id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

    if (existing.posted_by !== userId) {
      return res.status(403).json({ error: "Not authorized to update this opportunity" });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (company !== undefined) updates.company = company;
    if (location !== undefined) updates.location = location;
    if (type !== undefined) updates.type = type;
    if (arm !== undefined) updates.arm = arm;
    if (salary_range !== undefined) updates.salary_range = salary_range;
    if (requirements !== undefined) updates.requirements = requirements;
    if (deadline !== undefined) updates.deadline = deadline;

    const { data, error } = await supabase
      .from("opportunities")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Opportunities] Update error:", error);
      return res.status(500).json({ error: "Failed to update opportunity" });
    }

    return res.json(data);
  } catch (err: any) {
    console.error("[Opportunities] Update exception:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

opportunitiesRoutes.delete("/api/opportunities/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { id } = req.params;

    const { data: existing } = await supabase
      .from("opportunities")
      .select("posted_by")
      .eq("id", id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

    if (existing.posted_by !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this opportunity" });
    }

    const { error } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[Opportunities] Delete error:", error);
      return res.status(500).json({ error: "Failed to delete opportunity" });
    }

    return res.status(204).send();
  } catch (err: any) {
    console.error("[Opportunities] Delete exception:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});
