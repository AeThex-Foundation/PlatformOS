const API_BASE = import.meta.env.VITE_API_BASE || "";

export interface Application {
  id: string;
  opportunity_id: string;
  user_id: string;
  status: "pending" | "reviewed" | "accepted" | "rejected" | "withdrawn";
  cover_letter?: string;
  resume_url?: string;
  created_at: string;
  updated_at: string;
  opportunity?: {
    title: string;
    company: string;
  };
}

export async function getMyApplications(): Promise<Application[]> {
  const response = await fetch(`${API_BASE}/api/applications/mine`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch applications");
  return response.json();
}

export async function submitApplication(data: {
  opportunity_id: string;
  cover_letter?: string;
  resume_url?: string;
}): Promise<Application> {
  const response = await fetch(`${API_BASE}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to submit application");
  return response.json();
}

export async function withdrawApplication(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/applications/${id}/withdraw`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to withdraw application");
}

export async function getApplicationsForOpportunity(opportunityId: string): Promise<Application[]> {
  const response = await fetch(`${API_BASE}/api/opportunities/${opportunityId}/applications`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch applications");
  return response.json();
}
