export interface Creator {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  primary_arm?: string;
  arm_affiliations: string[];
  skills: string[];
  roles: string[];
  is_architect: boolean;
  devconnect_linked?: boolean;
  last_active_at?: string;
  created_at?: string;
  passport_level?: number;
  passport_xp?: number;
  realm?: string;
  is_verified?: boolean;
  aethex_domain?: string;
  division?: 'Ethos' | 'Forge' | 'Visuals';
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

interface BackendCreator {
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  arms: string[];
  roles: string[];
  is_architect: boolean;
  last_active_at: string;
  created_at: string;
}

interface BackendResponse {
  creators: BackendCreator[];
  count: number;
  filters: {
    arm: string | null;
    role: string | null;
    sort: string;
    featured: boolean;
  };
}

function getDivisionFromArms(arms: string[]): 'Ethos' | 'Forge' | 'Visuals' | undefined {
  if (arms.includes('ETHOS')) return 'Ethos';
  if (arms.includes('GAMEFORGE') || arms.includes('LABS')) return 'Forge';
  if (arms.includes('STUDIO')) return 'Visuals';
  return undefined;
}

function transformCreator(backend: BackendCreator): Creator {
  return {
    id: backend.username,
    username: backend.username,
    display_name: backend.full_name || backend.username,
    avatar_url: backend.avatar_url || undefined,
    bio: backend.bio || undefined,
    primary_arm: backend.arms?.[0],
    arm_affiliations: backend.arms || [],
    skills: [],
    roles: backend.roles || [],
    is_architect: backend.is_architect,
    devconnect_linked: false,
    last_active_at: backend.last_active_at,
    created_at: backend.created_at,
    passport_level: backend.is_architect ? 25 : undefined,
    passport_xp: undefined,
    realm: undefined,
    is_verified: backend.is_architect,
    aethex_domain: backend.is_architect ? `${backend.username}.aethex` : undefined,
    division: getDivisionFromArms(backend.arms || []),
  };
}

export async function getCreators(params: GetCreatorsParams): Promise<GetCreatorsResponse> {
  const { arm, search, page = 1, limit = 12 } = params;
  
  try {
    const queryParams = new URLSearchParams();
    if (arm) queryParams.set("arm", arm.toUpperCase());
    if (search) queryParams.set("search", search);
    
    const response = await fetch(`/api/creators?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch creators");
    }
    
    const backendData: BackendResponse = await response.json();
    
    const creators = backendData.creators.map(transformCreator);
    
    const startIndex = (page - 1) * limit;
    const paginatedCreators = creators.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(creators.length / limit);
    
    return {
      data: paginatedCreators,
      pagination: {
        page,
        limit,
        total: backendData.count,
        pages: totalPages,
      },
    };
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
    const data = await response.json();
    return transformCreator(data);
  } catch (error) {
    console.error("Error fetching creator:", error);
    return null;
  }
}
