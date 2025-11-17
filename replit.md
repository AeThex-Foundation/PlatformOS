# Guardian's Hub (AeThex Foundation)

## Overview

Guardian's Hub is the **AeThex Passport Authentication Provider** and official Foundation website. It serves as the "Government" that issues and manages all AeThex identities.

**Critical Architecture:**
- **Foundation = The "Government"**: Owns and governs the Passport system
- **Foundation OWNS**: The master Supabase `user_profiles` database (the only app with write access)
- **Foundation IS**: The authentication provider for all AeThex properties (aethex.dev, aethex.sbs, etc.)
- **Foundation HANDLES**: All signup, onboarding, and identity management
- **Foundation HOSTS**: aethex.foundation, aethex.me, aethex.space, and .aethex domains

**The "Axiom Model" (Separation of Powers):**
- The Corp (aethex.dev) is a "client" that must request authentication from the Foundation
- The Corp has a revocable license to use the Passport SSO system
- This creates the ultimate "leash" - the Foundation can revoke access if the Corp "goes evil"

## User Preferences

- The user wants iterative development.
- The user wants the agent to ask before making major changes.
- The user wants detailed explanations.
- The user prefers clean, functional code.
- The user wants the agent to use simple and clear language.
- The user wants the agent to strictly adhere to the red and gold color scheme.

## System Architecture

The Guardian's Hub is a Single Page Application (SPA) built with React 18, TypeScript, Vite, and TailwindCSS 3 for the frontend. The backend utilizes an Express server integrated with the Vite development server.

### UI/UX Decisions
- **Color Scheme:** Exclusively uses a red and gold theme (#EF4444 for red accent).
- **Component Library:** Radix UI is used for pre-built UI components, styled with TailwindCSS 3.
- **Iconography:** Lucide React icons are integrated.
- **Design Approach:** The site is structured into distinct public "Trust Billboard" pages and private "Hub" pages accessible after login.

### Technical Implementations
- **Frontend:** React 18, React Router 6, TypeScript, Vite, TailwindCSS 3.
- **Backend:** Express server, integrated with Vite.
- **Testing:** Vitest.
- **Authentication:** Supabase authentication with Foundation as the SOLE owner of user_profiles database.
- **Passport System:** This application IS the AeThex Passport (SSO) authentication provider.
- **OAuth Provider:** Exposes OAuth 2.0 endpoints for client applications (aethex.dev, etc.) to consume.
- **Email Functionality:** Nodemailer for email services.
- **Routing:**
    - **Public Pages (Trust Billboard):**
        - `/` - Foundation homepage
        - `/about` - Foundation mission & Axiom Model
        - `/foundation` - Foundation info, projects, workshops
        - `/ethics-council` - Ethics Council roster
        - `/contact` - Contact form
    - **Authentication Pages (Passport System):**
        - `/login` - User login (SSO provider)
        - `/signup` - User registration (creates Passport)
        - `/onboarding` - New user onboarding flow
        - `/profile/settings` - User profile management
    - **OAuth Provider Endpoints:**
        - `/api/oauth/authorize` - OAuth authorization endpoint
        - `/api/oauth/token` - OAuth token endpoint
        - `/api/oauth/userinfo` - OAuth user info endpoint
    - **Hub Pages (Logged-in Experience):**
        - `/hub` - Community dashboard landing page
        - `/hub/protocol` - Protocol documentation & whitepaper
        - `/hub/governance` - DAO governance integration (Tally.xyz)
        - `/hub/community` - Community bounty board & collaboration
    - **Passport Pages:**
        - `/:username` - Public user passport profile (wildcard routing)
        - `/api/passport/:username` - Public profile API endpoint

### System Design Choices
- **Monorepo Structure (Initial):** Though now a standalone repository, the project was initially part of a larger monorepo, leading to a focus on clear separation of concerns.
- **Type Safety:** TypeScript is used across client, server, and shared interfaces for type-safe communication.
- **Development Environment:** Configured for single-port development with Vite + Express integration, offering full hot reload.
- **Production Readiness:** Designed for production deployment with dedicated build and run commands.

## External Dependencies

- **Supabase:** For user authentication and potentially other backend services.
- **Nodemailer:** For sending emails.
- **Tally.xyz:** Integrated for DAO governance functionalities within the `/hub/governance` section.

## Recent Changes

### November 17, 2025 - CRITICAL ARCHITECTURE PIVOT: Foundation as Auth Provider
- **The "Axiom" Identity Pivot**:
  - Foundation (Guardian's Hub) is NOW the authentication provider for all AeThex properties
  - Foundation OWNS the Supabase user_profiles database (sole write access)
  - Foundation handles ALL signup, onboarding, and identity management
  - aethex.dev becomes a CLIENT that requests auth from Foundation via OAuth
- **Phase 1: Documentation Updated** (COMPLETED):
  - Updated all architecture documentation to reflect Foundation as "Government"
  - Clarified Foundation owns Passport system and user database
  - Documented OAuth provider endpoints Foundation will expose
- **Phase 2: COMPLETED - Restored Auth System**:
  - ✅ Created /signup page with email/password and OAuth options
  - ✅ Created /onboarding page with 3-step flow (username, profile, review)
  - ✅ Implemented username availability checking (real-time Supabase validation)
  - ✅ Updated Login to redirect new users (no username) to /onboarding
  - ✅ OAuth flows properly redirect to /onboarding via sessionStorage
  - ✅ Email verification flow: signup → verify email → login → onboarding
  - Note: Currently using `username` presence as onboarding completion indicator
  - TODO Phase 2.5: Add `onboarded` boolean field to Supabase user_profiles table
- **Phase 3: COMPLETED - OAuth Provider**:
  - ✅ Created OAuth database schema (oauth_clients, oauth_authorization_codes, oauth_refresh_tokens)
  - ✅ Implemented OAuth service layer with PKCE support
  - ✅ Built /api/oauth/authorize endpoint (authorization code flow)
  - ✅ Built /api/oauth/token endpoint (code exchange + refresh)
  - ✅ Built /api/oauth/userinfo endpoint (OpenID Connect)
  - ✅ Pre-seeded "AeThex Corporation" client for aethex.dev
  - ✅ Generated secure client_secret for AeThex Corporation client (confidential client mode)
  - ✅ Created authentication middleware (validates Supabase sessions, attaches req.user)
  - ✅ Fixed OAuth flow continuity (new user → onboarding → back to authorize)
  - ✅ Patched open redirect vulnerability (validates relative paths only)
  - ✅ Fixed double-decode bug in OAuth parameter handling
  - ✅ Discord OAuth Dashboard Integration: Added Connections tab to Dashboard with link/unlink functionality
  - Note: Access tokens use base64 encoding for MVP (upgrade to RS256 JWT in production)
  - **OAuth Client Credentials:** Documented in CORP-OAUTH-CREDENTIALS.md for aethex.dev integration

### November 17, 2025 - Made Foundation Page Accessible
- Added "Foundation" link to public navigation menu
- Page displays Foundation mission, open-source projects, workshops, and resources
- Visible to all visitors (not hidden behind authentication)

### November 17, 2025 - Foundation Branding & Metadata Updates
- **Updated All Icons & Social Cards**:
  - Changed favicon from blue GitBook logo to Foundation logo (`/foundation-logo.png`)
  - Updated OpenGraph image for social media sharing (Facebook, LinkedIn)
  - Updated Twitter/X card image
  - Updated Apple Touch icon
  - Updated JSON-LD structured data logo
  - Updated SEO component to always use Foundation logo as fallback
  - Changed page title prefix from "AeThex" to "AeThex Foundation"
- **Production Deployment Configuration**:
  - Added production start script: `npm start` (uses tsx to run TypeScript server)
  - Updated server to serve static files from `dist/spa` in production
  - Configured deployment with build command (`npm run build`) and run command (`npm start`)
  - Set deployment target to `autoscale` for stateless web app scaling
- **Result**: All browser tabs, social shares, and app icons now display Foundation red/gold branding

### November 17, 2025 - Phase 4: COMPLETED - Passport Wildcard Routing & Public Profiles
- **Public Passport Profiles**:
  - ✅ Created `/api/passport/:username` endpoint for public profile data
  - ✅ Implemented username validation with regex (`/^[a-z0-9_-]{3,30}$/`)
  - ✅ Reserved username blocking (foundation, login, signup, hub, admin, api, auth, oauth, etc.)
  - ✅ Public fields only: username, full_name, avatar_url, bio, location, social links, stats
  - ✅ Achievement count fetched from `user_achievements` table (accurate badge counts)
  - ✅ Response caching (5 minutes) for performance
- **Passport React Component**:
  - ✅ Built Passport profile page with Foundation red/gold branding
  - ✅ Displays avatar, name, username, bio, stats (level, XP, badges)
  - ✅ Shows location, join date, social links (website, GitHub, Twitter, LinkedIn)
  - ✅ Loading states and 404 error handling
  - ✅ Responsive Card-based design
- **Wildcard Routing**:
  - ✅ Added `/:username` route to React Router (positioned before 404, after specific routes)
  - ✅ Integrated with Express server at `/api/passport`
  - ✅ Prevents route conflicts with reserved usernames
- **SEO & Social Sharing**:
  - ✅ Enhanced SEO component with Twitter Card support (`twitter:card: summary_large_image`)
  - ✅ Dynamic OpenGraph tags (og:title, og:description, og:image, og:url)
  - ✅ Canonical URLs for proper SEO
  - ✅ Personalized meta tags: "{full_name} (@{username})" with bio and avatar
  - ✅ Foundation logo fallback for profiles without avatars
  - ✅ Proper social media previews on Twitter, Facebook, LinkedIn
- **Result**: Public Passport profiles now accessible at `aethex.foundation/{username}` with full SEO/social sharing support

### November 17, 2025 - OAuth Database Migration & Footer Branding Update
- **OAuth Tables Created on Supabase**:
  - ✅ Created `oauth_authorization_codes` table on shared Supabase database
  - ✅ Created `oauth_refresh_tokens` table on shared Supabase database
  - ✅ Inserted AeThex Corporation OAuth client with secure credentials
  - ✅ OAuth authentication flow now fully operational between Foundation and Corp
  - Note: All OAuth tables exist on shared Supabase (not local PostgreSQL)
- **Footer Links Updated for Foundation Branding**:
  - ✅ Changed "Services" → "Foundation Programs" (Passport, OAuth Provider, Open Source, Workshops)
  - ✅ Changed "Company" → "About Foundation" (Mission, Ethics Council, Contact, Governance, Community)
  - ✅ Changed "Resources" → "Developer Resources" (Protocol Docs, OAuth Guide, Passport API, GitHub, Whitepaper)
  - ✅ Updated copyright to "AeThex Foundation" (from "AeThex Corporation")
  - **Result**: Footer now reflects Foundation's role as authentication provider and governance body
- **Verified Live Passport Profiles**: 7 user profiles accessible on Foundation (manchestergaming321, diakolana4, andersonfgladney, austinrivas484, warningboom, andersongladney, mrpiglr)