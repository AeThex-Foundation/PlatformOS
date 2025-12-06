export interface Creator {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  arm: string;
  skills: string[];
  level: number;
  xp: number;
  verified: boolean;
  for_hire: boolean;
  portfolio_url?: string;
  social_links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

interface GetCreatorsParams {
  arm?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface GetCreatorsResponse {
  data: Creator[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getCreators(params: GetCreatorsParams): Promise<GetCreatorsResponse> {
  const { arm, search, page = 1, limit = 12 } = params;
  
  try {
    const queryParams = new URLSearchParams();
    if (arm) queryParams.set("arm", arm);
    if (search) queryParams.set("search", search);
    queryParams.set("page", String(page));
    queryParams.set("limit", String(limit));
    
    const response = await fetch(`/api/creators?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch creators");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching creators:", error);
    return {
      data: [],
      pagination: { page, limit, total: 0, pages: 0 },
    };
  }
}

export async function getCreatorByUsername(username: string): Promise<Creator | null> {
  try {
    const response = await fetch(`/api/creators/${username}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch creator");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching creator:", error);
    return null;
  }
}
