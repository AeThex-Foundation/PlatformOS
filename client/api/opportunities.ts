const API_BASE = import.meta.env.VITE_API_BASE || "";

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: string;
  arm: string;
  salary_range?: string;
  created_at: string;
  deadline?: string;
  requirements?: string[];
  posted_by: string;
}

export interface PaginatedOpportunities {
  data: Opportunity[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export async function getOpportunities(filters?: {
  arm?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}): Promise<PaginatedOpportunities> {
  const params = new URLSearchParams();
  if (filters?.arm) params.set("arm", filters.arm);
  if (filters?.type) params.set("type", filters.type);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.sort) params.set("sort", filters.sort);

  try {
    const response = await fetch(`${API_BASE}/api/opportunities?${params}`);
    if (!response.ok) {
      return { data: [], pagination: { page: 1, pages: 1, total: 0, limit: 12 } };
    }
    const result = await response.json();
    if (Array.isArray(result)) {
      return { data: result, pagination: { page: 1, pages: 1, total: result.length, limit: 12 } };
    }
    return result;
  } catch {
    return { data: [], pagination: { page: 1, pages: 1, total: 0, limit: 12 } };
  }
}

export async function getOpportunityById(id: string): Promise<Opportunity> {
  const response = await fetch(`${API_BASE}/api/opportunities/${id}`);
  if (!response.ok) throw new Error("Failed to fetch opportunity");
  return response.json();
}

export async function createOpportunity(data: Partial<Opportunity>): Promise<Opportunity> {
  const response = await fetch(`${API_BASE}/api/opportunities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to create opportunity");
  return response.json();
}

export async function updateOpportunity(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
  const response = await fetch(`${API_BASE}/api/opportunities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update opportunity");
  return response.json();
}

export async function deleteOpportunity(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/opportunities/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to delete opportunity");
}
