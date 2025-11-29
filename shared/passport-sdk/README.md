# AeThex Passport SDK

Official OAuth 2.0 client for AeThex Foundation Single Sign-On (SSO).

The AeThex Passport SDK allows your application to authenticate users through the AeThex Foundation identity provider, providing a seamless login experience across all AeThex properties.

## Installation

```bash
npm install @aethex/passport-sdk
# or
yarn add @aethex/passport-sdk
# or
pnpm add @aethex/passport-sdk
```

## Quick Start

### Vanilla JavaScript/TypeScript

```typescript
import { AeThexPassport } from '@aethex/passport-sdk';

const passport = new AeThexPassport({
  clientId: 'your_client_id',
  redirectUri: 'https://your-app.com/auth/callback',
});

// Check if user is authenticated
if (passport.isAuthenticated()) {
  const user = await passport.getUser();
  console.log('Welcome,', user.name);
} else {
  // Initiate login
  passport.login();
}
```

### React Integration

```tsx
import { PassportProvider, usePassport, LoginButton, LogoutButton } from '@aethex/passport-sdk/react';

// 1. Wrap your app with PassportProvider
function App() {
  return (
    <PassportProvider
      clientId="your_client_id"
      redirectUri="https://your-app.com/auth/callback"
    >
      <YourApp />
    </PassportProvider>
  );
}

// 2. Use the hook in your components
function Profile() {
  const { user, isAuthenticated, isLoading } = usePassport();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <LoginButton className="btn btn-primary">Sign in with AeThex</LoginButton>;
  }
  
  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h1>Welcome, {user.name}!</h1>
      <p>@{user.username}</p>
      <LogoutButton>Sign out</LogoutButton>
    </div>
  );
}
```

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `clientId` | string | Yes | - | Your OAuth client ID (provided by Foundation) |
| `redirectUri` | string | Yes | - | The callback URL registered for your app |
| `foundationUrl` | string | No | `https://aethex.foundation` | Foundation OAuth server URL |
| `scopes` | string[] | No | `['openid', 'profile', 'email']` | Requested OAuth scopes |

## API Reference

### AeThexPassport Class

#### `login(options?: { returnTo?: string })`
Initiates the OAuth login flow. Redirects user to Foundation login page.

```typescript
// Simple login
passport.login();

// Login with return URL
passport.login({ returnTo: '/dashboard' });
```

#### `handleCallback(): Promise<PassportUser | null>`
Handles the OAuth callback after user authenticates. Call this on your callback page.

```typescript
// On your /auth/callback page
const user = await passport.handleCallback();
if (user) {
  console.log('Logged in as', user.username);
}
```

#### `getUser(): Promise<PassportUser | null>`
Fetches the current authenticated user's profile.

```typescript
const user = await passport.getUser();
```

#### `isAuthenticated(): boolean`
Checks if a user is currently authenticated (has valid tokens).

```typescript
if (passport.isAuthenticated()) {
  // User is logged in
}
```

#### `logout(options?: { redirect?: boolean })`
Logs out the user and clears stored tokens.

```typescript
// Local logout only
passport.logout();

// Redirect to Foundation logout
passport.logout({ redirect: true });
```

#### `getAccessToken(): Promise<string | null>`
Gets the current access token, refreshing if needed.

```typescript
const token = await passport.getAccessToken();
// Use token for API calls
```

#### `fetch(url: string, options?: RequestInit): Promise<Response>`
Authenticated fetch wrapper that automatically adds Authorization header.

```typescript
const response = await passport.fetch('https://api.example.com/data');
```

### React Hooks & Components

#### `usePassport()`
Main hook for accessing passport functionality.

```typescript
const {
  user,           // PassportUser | null
  isAuthenticated, // boolean
  isLoading,      // boolean
  error,          // Error | null
  login,          // (options?) => void
  logout,         // (options?) => void
  getAccessToken, // () => Promise<string | null>
} = usePassport();
```

#### `<LoginButton>`
Pre-built login button component.

```tsx
<LoginButton className="btn" returnTo="/dashboard">
  Sign in with AeThex
</LoginButton>
```

#### `<LogoutButton>`
Pre-built logout button component.

```tsx
<LogoutButton className="btn" redirect>
  Sign out
</LogoutButton>
```

#### `<ProtectedRoute>`
Wrapper for routes that require authentication.

```tsx
<ProtectedRoute fallback={<Loading />} redirectTo="/login">
  <Dashboard />
</ProtectedRoute>
```

## User Profile Schema

```typescript
interface PassportUser {
  sub: string;        // Unique user ID
  username: string;   // AeThex username
  name: string;       // Display name
  email: string;      // Email address
  picture: string;    // Avatar URL
  profile: string;    // Foundation profile URL
  bio?: string;       // User bio
  github?: string;    // GitHub URL
  twitter?: string;   // Twitter URL
  linkedin?: string;  // LinkedIn URL
}
```

## OAuth Scopes

| Scope | Description |
|-------|-------------|
| `openid` | Required for OIDC compliance |
| `profile` | Access to username, name, picture, bio |
| `email` | Access to email address |
| `achievements` | Access to user achievements and badges |
| `projects` | Access to user projects |

## Security

This SDK implements OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for Code Exchange) for enhanced security:

- **PKCE Protection**: Prevents authorization code interception attacks
- **State Parameter**: Protects against CSRF attacks
- **Secure Token Storage**: Tokens stored in localStorage with automatic refresh
- **Token Expiry Handling**: Automatic token refresh before expiry

## Callback Page Setup

Create a callback page at your registered `redirectUri`:

```tsx
// pages/auth/callback.tsx
import { useEffect, useState } from 'react';
import { usePassport } from '@aethex/passport-sdk/react';

export default function AuthCallback() {
  const { isLoading, error } = usePassport();
  
  if (error) {
    return <div>Authentication failed: {error.message}</div>;
  }
  
  if (isLoading) {
    return <div>Completing sign in...</div>;
  }
  
  // Redirect is handled automatically by the SDK
  return null;
}
```

## Support

- Documentation: https://aethex.foundation/docs/passport
- Issues: https://github.com/aethex/passport-sdk/issues
- Discord: https://discord.gg/aethex

## License

MIT License - AeThex Foundation
