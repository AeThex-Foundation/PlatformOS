/**
 * AeThex Passport React Integration
 * React hooks and context for AeThex Foundation SSO
 * 
 * Usage:
 * ```tsx
 * import { PassportProvider, usePassport } from '@aethex/passport-sdk/react';
 * 
 * // Wrap your app
 * <PassportProvider clientId="aethex_studio" redirectUri="https://aethex.studio/auth/callback">
 *   <App />
 * </PassportProvider>
 * 
 * // Use in components
 * function Profile() {
 *   const { user, isAuthenticated, login, logout, isLoading } = usePassport();
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   
 *   if (!isAuthenticated) {
 *     return <button onClick={() => login()}>Sign in with AeThex</button>;
 *   }
 *   
 *   return (
 *     <div>
 *       <img src={user.picture} alt={user.name} />
 *       <h1>{user.name}</h1>
 *       <button onClick={() => logout()}>Sign out</button>
 *     </div>
 *   );
 * }
 * ```
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { AeThexPassport, PassportConfig, PassportUser } from './index';

interface PassportContextValue {
  passport: AeThexPassport | null;
  user: PassportUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (options?: { returnTo?: string }) => void;
  logout: (options?: { redirect?: boolean }) => void;
  getAccessToken: () => Promise<string | null>;
}

const PassportContext = createContext<PassportContextValue | null>(null);

interface PassportProviderProps extends Omit<PassportConfig, 'storage'> {
  children: ReactNode;
  onAuthStateChange?: (user: PassportUser | null) => void;
}

export function PassportProvider({ 
  children, 
  clientId, 
  redirectUri,
  foundationUrl,
  scopes,
  onAuthStateChange,
}: PassportProviderProps) {
  const [passport] = useState(() => new AeThexPassport({
    clientId,
    redirectUri,
    foundationUrl,
    scopes,
  }));
  
  const [user, setUser] = useState<PassportUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isAuthenticated = !!user;

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (passport.isAuthenticated()) {
        const userData = await passport.getUser();
        setUser(userData);
        onAuthStateChange?.(userData);
      } else {
        setUser(null);
        onAuthStateChange?.(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load user'));
      setUser(null);
      onAuthStateChange?.(null);
    } finally {
      setIsLoading(false);
    }
  }, [passport, onAuthStateChange]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasCode = params.has('code');
    
    if (hasCode) {
      passport.handleCallback()
        .then((userData) => {
          if (userData) {
            setUser(userData);
            onAuthStateChange?.(userData);
          }
          window.history.replaceState({}, '', window.location.pathname);
        })
        .catch((err) => {
          setError(err instanceof Error ? err : new Error('Callback failed'));
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      loadUser();
    }
  }, [passport, loadUser, onAuthStateChange]);

  const login = useCallback((options?: { returnTo?: string }) => {
    passport.login(options);
  }, [passport]);

  const logout = useCallback((options?: { redirect?: boolean }) => {
    passport.logout(options);
    setUser(null);
    onAuthStateChange?.(null);
  }, [passport, onAuthStateChange]);

  const getAccessToken = useCallback(() => {
    return passport.getAccessToken();
  }, [passport]);

  const value: PassportContextValue = {
    passport,
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    getAccessToken,
  };

  return (
    <PassportContext.Provider value={value}>
      {children}
    </PassportContext.Provider>
  );
}

export function usePassport(): PassportContextValue {
  const context = useContext(PassportContext);
  
  if (!context) {
    throw new Error('usePassport must be used within a PassportProvider');
  }
  
  return context;
}

export function usePassportUser(): PassportUser | null {
  const { user } = usePassport();
  return user;
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = usePassport();
  return isAuthenticated;
}

export function LoginButton({ 
  children = 'Sign in with AeThex',
  className,
  returnTo,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { returnTo?: string }) {
  const { login, isLoading } = usePassport();
  
  return (
    <button
      onClick={() => login({ returnTo })}
      disabled={isLoading}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function LogoutButton({ 
  children = 'Sign out',
  className,
  redirect = false,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { redirect?: boolean }) {
  const { logout, isLoading } = usePassport();
  
  return (
    <button
      onClick={() => logout({ redirect })}
      disabled={isLoading}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function withPassport<P extends object>(
  Component: React.ComponentType<P & PassportContextValue>
) {
  return function WithPassport(props: P) {
    const passportContext = usePassport();
    return <Component {...props} {...passportContext} />;
  };
}

export interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, fallback, redirectTo }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login } = usePassport();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectTo) {
      login({ returnTo: window.location.href });
    }
  }, [isLoading, isAuthenticated, redirectTo, login]);
  
  if (isLoading) {
    return <>{fallback || <div>Loading...</div>}</>;
  }
  
  if (!isAuthenticated) {
    return <>{fallback || null}</>;
  }
  
  return <>{children}</>;
}

export default {
  PassportProvider,
  usePassport,
  usePassportUser,
  useIsAuthenticated,
  LoginButton,
  LogoutButton,
  ProtectedRoute,
  withPassport,
};
