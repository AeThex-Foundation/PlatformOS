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
    - **Profile System:** `/profile/me` (user's own profile), `/profile/:username` (other user profiles), `/profile/edit` (edit profile).

### System Design Choices
- **Type Safety:** TypeScript for type-safe communication across client, server, and shared interfaces.
- **Development Environment:** Single-port development with Vite + Express integration, hot reload.
- **Production Readiness:** Dedicated build and run commands for production deployment with `autoscale` target.
- **Data Model:** Comprehensive Supabase schema including tables for `achievements`, `user_achievements`, `workshops`, `workshop_registrations`, `resources`, `resource_downloads`, `bounties`, and `bounty_applications`, all with RLS policies and indexes. Extended profile fields include `skills_detailed`, `languages`, `work_experience`, `portfolio_items`, and `arm_affiliations` for rich user profiles.
- **Security:** Global `authMiddleware` applied to authenticated routes, explicit role checks for admin endpoints, and service-role Supabase client used only after identity verification.
- **Monorepo Structure:** Initially part of a monorepo, fostering clear separation of concerns.

### Blockchain Governance System
- **Smart Contract Infrastructure:** Hardhat 2 development environment with Solidity 0.8.24 and Cancun EVM.
- **DAO Architecture:** OpenZeppelin Governor standard implementation with three core contracts:
  - `AethexToken.sol`: ERC20 governance token (AETH) with voting and permit capabilities.
  - `AethexTimelock.sol`: 2-day execution delay for approved proposals.
  - `AethexGovernor.sol`: On-chain governance with 1-day voting delay, 1-week voting period, 4% quorum.
- **Deployment:** Live on Ethereum Sepolia testnet (November 24, 2025):
  - Token: `0xf846380e25b34B71474543fdB28258F8477E2Cf1`
  - Timelock: `0xDA8B4b2125B8837cAaa147265B401056b636F1D5`
  - Governor: `0x6660344dA659aAcA0a7733dd70499be7ffa9F4Fa`
  - All contracts verified on Sepolia Etherscan.
- **Governance Integration:** Designed for Tally.xyz integration for proposal creation, voting, and treasury management.

## Recent Changes (November 21, 2025)

### Profile System Implementation
- **New Pages Created:**
  - `ProfileView.tsx`: Displays user profiles at `/profile/me` and `/profile/:username` with comprehensive information display including stats, skills, work experience, and portfolio items. Includes authentication redirect for `/profile/me` route.
  - `ProfileEdit.tsx`: Allows users to edit their profile information at `/profile/edit` with form validation and real-time updates.

- **Backend API Enhancements:**
  - `GET /api/profile/:username`: Public endpoint to retrieve any user's profile by username.
  - `PUT /api/profile`: Authenticated endpoint for users to update their own profile information.

- **Type System Updates:**
  - Extended `AethexUserProfile` interface in `aethex-database-adapter.ts` to include `skills_detailed`, `languages`, `work_experience`, `portfolio_items`, and `arm_affiliations` fields.
  - Fixed role selection options to match database enum values: `client`, `game_developer`, `community_member`, `customer`, `staff`.

- **Routes Added:**
  - `/profile/me`: View own profile (requires authentication, redirects to `/login` if not authenticated).
  - `/profile/:username`: View any user's public profile.
  - `/profile/edit`: Edit own profile (requires authentication).

### Community Routes Fixed
- **New Page Created:**
  - `FoundationCommunity.tsx`: Landing page for `/foundation/community` that provides navigation to teams, about, leaderboard, and creator directory sections.

- **Routes Added:**
  - `/foundation/community`: Public community landing page with links to all community resources.

## External Dependencies

- **Supabase:** Used for user authentication, database management (including OAuth tables), and backend services.
- **Nodemailer:** Utilized for sending emails (e.g., verification emails).
- **Tally.xyz:** Integrated for DAO governance functionalities within the `/hub/governance` section.