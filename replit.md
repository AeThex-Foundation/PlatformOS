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
        - `/:username.aethex.me` - User passport profile (wildcard routing)

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
- **Phase 3: PENDING - OAuth Provider**:
  - Build OAuth 2.0 endpoints for client apps to consume
  - Enable aethex.dev to authenticate via Foundation

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