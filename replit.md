# Guardian's Hub (AeThex Foundation)

## Overview

Guardian's Hub is the AeThex Passport Authentication Provider and the official Foundation website. It acts as the "Government" responsible for issuing and managing all AeThex identities. Its core purpose is to serve as the authentication provider for all AeThex properties, handle user onboarding and identity management, and host various AeThex domains. A key architectural principle establishes Labs as the governing body for the Passport system, owning the master Supabase `user_profiles` database and providing authentication services to client applications.

## User Preferences

- The user wants iterative development.
- The user wants the agent to ask before making major changes.
- The user wants detailed explanations.
- The user prefers clean, functional code.
- The user wants the agent to use simple and clear language.
- The user wants the agent to strictly adhere to the red and gold color scheme.

## System Architecture

The Guardian's Hub is a Single Page Application (SPA) built with React 18, TypeScript, Vite, and TailwindCSS 3 for the frontend, with an Express server integrated for the backend.

### UI/UX Decisions
- **Color Scheme:** Exclusively uses a red and gold theme (#EF4444 for red accent).
- **Component Library:** Radix UI for components, styled with TailwindCSS 3.
- **Iconography:** Lucide React icons.
- **Design Approach:** Public "Trust Billboard" pages and private "Hub" pages post-login.

### Technical Implementations
- **Frontend:** React 18, React Router 6, TypeScript, Vite, TailwindCSS 3.
- **Backend:** Express server, integrated with Vite, utilizing `tsx` for TypeScript execution in production.
- **Authentication:** Supabase authentication, with Foundation as the sole owner of the `user_profiles` database.
- **Passport System:** Functions as the AeThex Passport (SSO) authentication provider.
- **OAuth Provider:** Exposes OAuth 2.0 endpoints (`/api/oauth/authorize`, `/api/oauth/token`, `/api/oauth/userinfo`) with PKCE support for client applications.
- **Email Functionality:** Nodemailer for email services.
- **Routing:**
    - **Public Pages:** `/`, `/about`, `/foundation`, `/ethics-council`, `/contact`.
    - **Authentication Pages:** `/login`, `/signup`, `/onboarding`, `/profile/settings`.
    - **Hub Pages (Logged-in):** `/hub`, `/hub/protocol`, `/hub/governance`, `/hub/community`.
    - **Passport Pages:** `/:username` (public profile), `/api/passport/:username` (public profile API).
    - **Creator Directory:** `/creators` (public directory with opt-in visibility).
    - **Admin Pages:** `/admin` (admin-only user management).
    - **Leaderboard:** `/leaderboard` (displays XP, streaks, badges).
    - **Workshops:** `/workshops` (upcoming workshops and registration).
    - **Resources:** `/resources` (Foundation guides, tools).
    - **User Sessions:** `/api/sessions` (active sessions).
    - **OAuth Clients:** `/api/oauth-clients` (manage authorized apps).

### System Design Choices
- **Type Safety:** TypeScript for type-safe communication across client, server, and shared interfaces.
- **Development Environment:** Single-port development with Vite + Express integration, hot reload.
- **Production Readiness:** Dedicated build and run commands for production deployment with `autoscale` target.
- **Data Model:** Comprehensive Supabase schema including tables for `achievements`, `user_achievements`, `workshops`, `workshop_registrations`, `resources`, `resource_downloads`, `bounties`, and `bounty_applications`, all with RLS policies and indexes.
- **Security:** Global `authMiddleware` applied to authenticated routes, explicit role checks for admin endpoints, and service-role Supabase client used only after identity verification.
- **Monorepo Structure:** Initially part of a monorepo, fostering clear separation of concerns.

## External Dependencies

- **Supabase:** Used for user authentication, database management (including OAuth tables), and backend services.
- **Nodemailer:** Utilized for sending emails (e.g., verification emails).
- **Tally.xyz:** Integrated for DAO governance functionalities within the `/hub/governance` section.