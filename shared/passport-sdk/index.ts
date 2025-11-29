/**
 * AeThex Passport SDK
 * Lightweight OAuth 2.0 client for AeThex Foundation SSO
 * 
 * Usage:
 * ```typescript
 * import { AeThexPassport } from '@aethex/passport-sdk';
 * 
 * const passport = new AeThexPassport({
 *   clientId: 'aethex_studio',
 *   redirectUri: 'https://aethex.studio/auth/callback',
 * });
 * 
 * // Initiate login
 * passport.login();
 * 
 * // Handle callback
 * const user = await passport.handleCallback();
 * 
 * // Get current user
 * const currentUser = await passport.getUser();
 * 
 * // Logout
 * passport.logout();
 * ```
 */

export interface PassportConfig {
  clientId: string;
  redirectUri: string;
  foundationUrl?: string;
  scopes?: string[];
  storage?: Storage;
}

export interface PassportUser {
  sub: string;
  username: string;
  name: string;
  email: string;
  picture: string | null;
  profile: string;
  bio?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'aethex_access_token',
  REFRESH_TOKEN: 'aethex_refresh_token',
  TOKEN_EXPIRY: 'aethex_token_expiry',
  CODE_VERIFIER: 'aethex_code_verifier',
  STATE: 'aethex_oauth_state',
};

export class AeThexPassport {
  private config: Required<PassportConfig>;
  private storage: Storage;

  constructor(config: PassportConfig) {
    this.config = {
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      foundationUrl: config.foundationUrl || 'https://aethex.foundation',
      scopes: config.scopes || ['openid', 'profile', 'email'],
      storage: config.storage || (typeof localStorage !== 'undefined' ? localStorage : null as any),
    };
    this.storage = this.config.storage;
  }

  /**
   * Generate PKCE code verifier and challenge
   */
  private async generatePKCE(): Promise<{ verifier: string; challenge: string }> {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const verifier = this.base64UrlEncode(array);
    
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const challenge = this.base64UrlEncode(new Uint8Array(hash));
    
    return { verifier, challenge };
  }

  /**
   * Generate a random state parameter
   */
  private generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  /**
   * Base64 URL encode
   */
  private base64UrlEncode(buffer: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  /**
   * Initiate OAuth login flow
   * Redirects user to Foundation login page
   */
  async login(options?: { returnTo?: string }): Promise<void> {
    const { verifier, challenge } = await this.generatePKCE();
    const state = this.generateState();
    
    this.storage.setItem(STORAGE_KEYS.CODE_VERIFIER, verifier);
    this.storage.setItem(STORAGE_KEYS.STATE, state);
    
    if (options?.returnTo) {
      this.storage.setItem('aethex_return_to', options.returnTo);
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `${this.config.foundationUrl}/api/oauth/authorize?${params}`;
    window.location.href = authUrl;
  }

  /**
   * Handle OAuth callback
   * Call this on your callback page to exchange code for tokens
   */
  async handleCallback(): Promise<PassportUser | null> {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      const description = params.get('error_description');
      throw new Error(`OAuth error: ${error} - ${description}`);
    }

    if (!code) {
      throw new Error('No authorization code in callback');
    }

    const storedState = this.storage.getItem(STORAGE_KEYS.STATE);
    if (state !== storedState) {
      throw new Error('Invalid state parameter - possible CSRF attack');
    }

    const codeVerifier = this.storage.getItem(STORAGE_KEYS.CODE_VERIFIER);
    if (!codeVerifier) {
      throw new Error('Missing code verifier - PKCE flow incomplete');
    }

    const tokens = await this.exchangeCode(code, codeVerifier);
    this.storeTokens(tokens);

    this.storage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
    this.storage.removeItem(STORAGE_KEYS.STATE);

    const user = await this.getUser();
    
    const returnTo = this.storage.getItem('aethex_return_to');
    this.storage.removeItem('aethex_return_to');
    
    if (returnTo) {
      window.location.href = returnTo;
      return null;
    }

    return user;
  }

  /**
   * Exchange authorization code for tokens
   */
  private async exchangeCode(code: string, codeVerifier: string): Promise<TokenResponse> {
    const response = await fetch(`${this.config.foundationUrl}/api/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token exchange failed: ${error.error_description || error.error}`);
    }

    return response.json();
  }

  /**
   * Store tokens in storage
   */
  private storeTokens(tokens: TokenResponse): void {
    this.storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
    this.storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
    
    const expiry = Date.now() + (tokens.expires_in * 1000);
    this.storage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiry.toString());
  }

  /**
   * Get current access token, refreshing if needed
   */
  async getAccessToken(): Promise<string | null> {
    const token = this.storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const expiry = this.storage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

    if (!token || !expiry) {
      return null;
    }

    if (Date.now() >= parseInt(expiry) - 60000) {
      return this.refreshAccessToken();
    }

    return token;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.config.foundationUrl}/api/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.config.clientId,
        }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const tokens: TokenResponse = await response.json();
      this.storeTokens(tokens);
      return tokens.access_token;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  /**
   * Get current authenticated user
   */
  async getUser(): Promise<PassportUser | null> {
    const token = await this.getAccessToken();
    
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${this.config.foundationUrl}/api/oauth/userinfo`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearTokens();
        }
        return null;
      }

      return response.json();
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const expiry = this.storage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    const refreshToken = this.storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!token || !expiry) {
      return false;
    }

    if (Date.now() >= parseInt(expiry)) {
      return !!refreshToken;
    }

    return true;
  }

  /**
   * Logout - clear tokens and optionally redirect to Foundation logout
   */
  logout(options?: { redirect?: boolean }): void {
    this.clearTokens();
    
    if (options?.redirect) {
      window.location.href = `${this.config.foundationUrl}/logout?return_to=${encodeURIComponent(window.location.origin)}`;
    }
  }

  /**
   * Clear stored tokens
   */
  private clearTokens(): void {
    this.storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    this.storage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  }

  /**
   * Create an authenticated fetch wrapper
   * Automatically adds Authorization header
   */
  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);

    return fetch(url, {
      ...options,
      headers,
    });
  }
}

export function createPassport(config: PassportConfig): AeThexPassport {
  return new AeThexPassport(config);
}

export default AeThexPassport;
