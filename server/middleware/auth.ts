/**
 * Authentication Middleware
 * Validates Supabase sessions and attaches user to request
 */

import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../oauth/oauth-service';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}

/**
 * Middleware to validate Supabase session and attach user to request
 * 
 * Checks for:
 * 1. Authorization header: Bearer <access_token>
 * 2. Cookie: sb-access-token
 * 
 * If valid session found, attaches user to req.user
 * If not, continues without req.user (allows routes to decide if auth is required)
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract token from Authorization header or cookie
    let accessToken: string | null = null;

    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    }

    // Fallback to cookie (for browser requests)
    if (!accessToken && req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      accessToken = cookies['sb-access-token'];
    }

    // If no token, continue without user
    if (!accessToken) {
      return next();
    }

    // Validate token with Supabase
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !data.user) {
      // Invalid token - continue without user
      return next();
    }

    // Attach user to request
    req.user = {
      id: data.user.id,
      email: data.user.email || '',
      role: data.user.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Continue without user on error (let routes handle missing auth)
    next();
  }
}

/**
 * Middleware to require authentication
 * Returns 401 if no valid session found
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'unauthorized',
      error_description: 'Authentication required',
    });
  }
  next();
}
