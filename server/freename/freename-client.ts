/**
 * Freename API Client
 * Handles subdomain registration and resolution for .aethex TLD
 */

const FREENAME_API_BASE = 'https://api.freename.io/v1';
const FREENAME_RESOLUTION_API = 'https://rslvr.freename.io/domain';

interface FreenameApiConfig {
  apiKey: string;
  tld: string;
}

interface DomainAvailabilityResponse {
  available: boolean;
  domain: string;
  price?: number;
}

interface DomainMintResponse {
  success: boolean;
  txHash?: string;
  tokenId?: string;
  error?: string;
}

interface DomainResolutionResponse {
  domain: string;
  records: {
    eth?: string;
    polygon?: string;
    ipfs?: string;
    [key: string]: string | undefined;
  };
  owner?: string;
}

export class FreenameClient {
  private apiKey: string;
  private tld: string;

  constructor(config: FreenameApiConfig) {
    this.apiKey = config.apiKey;
    this.tld = config.tld;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${FREENAME_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `Freename API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Check if a subdomain is available
   */
  async checkAvailability(subdomain: string): Promise<DomainAvailabilityResponse> {
    const domain = `${subdomain}.${this.tld}`;
    
    try {
      const result = await this.request(`/domains/check?domain=${encodeURIComponent(domain)}`);
      return {
        available: result.available ?? true,
        domain,
        price: result.price,
      };
    } catch (error) {
      console.error('[Freename] Availability check error:', error);
      return {
        available: false,
        domain,
      };
    }
  }

  /**
   * Register a subdomain for a user
   */
  async mintSubdomain(
    subdomain: string,
    ownerAddress: string,
    records?: { [key: string]: string }
  ): Promise<DomainMintResponse> {
    const domain = `${subdomain}.${this.tld}`;

    try {
      const result = await this.request('/domains/mint', {
        method: 'POST',
        body: JSON.stringify({
          domain,
          owner: ownerAddress,
          blockchain: 'polygon',
          records: {
            'crypto.MATIC.address': ownerAddress,
            'crypto.ETH.address': ownerAddress,
            ...records,
          },
        }),
      });

      return {
        success: true,
        txHash: result.txHash,
        tokenId: result.tokenId,
      };
    } catch (error: any) {
      console.error('[Freename] Mint error:', error);
      return {
        success: false,
        error: error.message || 'Failed to mint domain',
      };
    }
  }

  /**
   * Resolve a domain to its records
   */
  async resolveDomain(domain: string): Promise<DomainResolutionResponse | null> {
    try {
      const response = await fetch(
        `${FREENAME_RESOLUTION_API}/resolve?q=${encodeURIComponent(domain)}`
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return {
        domain,
        records: result.records || {},
        owner: result.owner,
      };
    } catch (error) {
      console.error('[Freename] Resolution error:', error);
      return null;
    }
  }

  /**
   * Get all subdomains under the TLD (for admin purposes)
   */
  async getSubdomains(page = 1, limit = 100): Promise<string[]> {
    try {
      const result = await this.request(`/tlds/${this.tld}/domains?page=${page}&limit=${limit}`);
      return result.domains || [];
    } catch (error) {
      console.error('[Freename] Get subdomains error:', error);
      return [];
    }
  }
}

let freenameClient: FreenameClient | null = null;

export function getFreenameClient(): FreenameClient {
  if (!freenameClient) {
    const apiKey = process.env.FREENAME_API_KEY;
    if (!apiKey) {
      throw new Error('FREENAME_API_KEY environment variable is not set');
    }
    freenameClient = new FreenameClient({
      apiKey,
      tld: 'aethex',
    });
  }
  return freenameClient;
}

export function createFreenameClient(apiKey: string, tld = 'aethex'): FreenameClient {
  return new FreenameClient({ apiKey, tld });
}
