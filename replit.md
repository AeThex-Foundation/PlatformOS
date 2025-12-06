# Guardian's Hub (AeThex Foundation)

## Overview

Guardian's Hub is the AeThex Passport Authentication Provider and the official Foundation website. It serves as the "Government" for issuing and managing all AeThex identities, handling user onboarding, identity management, and hosting various AeThex domains. It provides authentication services for all AeThex properties, with Labs owning the master Supabase `user_profiles` database. The project also incorporates a blockchain-based governance system and a .aethex Passport Domain System.

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
- **Authentication:** Supabase authentication, serving as the AeThex Passport (SSO) authentication provider with OAuth 2.0 endpoints (with PKCE support).
- **Email Functionality:** Nodemailer for email services.
- **Routing:** Comprehensive routing for public, authentication, logged-in hub, passport, admin, user session, and OAuth client management pages, including profile management and legacy redirects.
- **Blockchain Governance System:** Hardhat development environment with Solidity 0.8.24, utilizing OpenZeppelin Governor for DAO architecture (AethexToken, AethexTimelock, AethexGovernor). Integrates with Polygon Mainnet and Sepolia Testnet.
- **Web3 Integration:** Custom governance UI built with Wagmi v2 and Viem for wallet connection, network selection, proposal creation, and voting.
- **.aethex Passport Domain System:** Token-gated blockchain domain claiming (`username.aethex`) with Freename integration for subdomain minting and resolution. Includes API endpoints for domain checks, balance verification, claiming, and resolution.
- **Passport Engine (Multi-Tenant Profiles):** Host-based routing for creator profiles (`*.aethex.me`) and project showcases (`*.aethex.space`). PassportRouter detects subdomain and renders appropriate view with dark/gameforge theme isolation. API endpoints at `/api/passport/:slug` and `/api/projects/:slug` fetch enriched data from Supabase including achievements, projects, follow stats, and team members.
- **Rich Passport System:** Full-featured passport profile pages with realm alignment (Development Forge, Strategist Nexus, Innovation Commons, Experience Hub), XP/Level progression with visual progress bars, "GOD Mode" badge for level 100+ users, achievement badges with emoji icons, Ethos Guild integration for audio portfolio, projects section, arm affiliations display, follower/following stats, degree connections (1st/2nd/3rd+), and social links including Spotify for creators.
- **Ethos Guild Integration:** Complete audio artist portfolio system with dedicated management pages:
  - **API Endpoints:** `/api/ethos/artists` (profile management), `/api/ethos/tracks` (published tracks with filters), `/api/ethos/my-profile` (authenticated user's profile and all tracks)
  - **Artist Settings (`/ethos/settings`):** Profile customization with skills selection (Mixing, Mastering, Sound Design, Composition, etc.), for-hire toggle, bio, portfolio URL, pricing settings (per track, SFX, scores), and turnaround time
  - **Track Library (`/ethos/library`):** Track management with upload dialog (file, title, description, genres, license type, BPM), playback controls, visibility toggle (publish/unpublish), and delete functionality
  - **Storage:** Uses Supabase bucket "ethos-tracks" for audio file storage with secure upload/download
  - **Database Tables:** ethos_tracks, ethos_artist_profiles, ethos_guild_members, ethos_licensing_agreements
  - **Security:** Authenticated-only access for unpublished tracks; ownership verification on update/delete operations
- **GameForge ARM Dashboard:** Complete project management system for game development:
  - **API Endpoints:** `/api/gameforge/projects` (CRUD), `/api/gameforge/sprints` (sprint management), `/api/gameforge/tasks` (task CRUD), `/api/gameforge/team` (team roster), `/api/gameforge/metrics` (project/sprint analytics)
  - **Dashboard (`/gameforge/dashboard`):** Tabbed interface with Overview (stats, countdown), Scope (sprint goal), Team (member cards), Tasks (Kanban board), and Sprints (management)
  - **SprintManager Component:** Create/join sprints, view sprint timeline, member tracking
  - **Database Tables:** gameforge_projects, gameforge_sprints, gameforge_sprint_members, gameforge_tasks, gameforge_team_members
  - **Security:** All endpoints require authentication; project leads have elevated permissions for CRUD operations
- **Passport Hub (`/passport`):** Central management hub with 4 tabbed sections:
  - **Directory Tab:** Public searchable member directory with filters (All, Verified, Level 10+), displaying passport holders with realm badges, levels, and verification status.
  - **Claim Tab:** Authenticated user passport customization allowing updates to active title, bio, and realm alignment with live preview.
  - **Showcase Tab:** Marketing page explaining passport features, realm system, XP progression, and identity ownership benefits.
  - **Admin Tab:** Admin-only dashboard (owner/admin/founder roles) with system stats, member management, and user verification toggles.
- **Cross-Domain SSO:** AeThex Passport SDK for client site integration with full PKCE support, React integration, automatic token refresh, and secure storage. Uses HS256 JWT for access tokens and provides OpenID Connect discovery.
- **Admin System:** CRUD operations for OAuth clients with role-based access control and session management.
- **Content Management:** Centralized content management for Foundation and Hub-specific data, including statistics, team members, milestones, resources, and governance details.
- **Mentorship System (`/mentorship`):** Complete mentorship platform with program listings, mentee hub, mentor applications, mentor profiles, and mentorship request flow.
- **Opportunities System (`/opportunities`):** Job and collaboration board with opportunity posting, search/filter by ARM, application submission, and application tracking.
- **Content Pages:** Blog system (`/blog`), activity feed (`/feed`), changelog (`/changelog`), system status (`/status`), and tutorials (`/tutorials`).
- **Staff Tools (`/staff/*`):** Internal staff pages including announcements, knowledge base, project tracking, team handbook, expense reports, learning portal, performance reviews, and internal marketplace.
- **Foundation Pages (`/foundation/*`):** Foundation member pages including dashboard, achievements, curriculum, contribute, get-involved, learn-more, and teams.

### System Design Choices
- **Type Safety:** TypeScript for type-safe communication.
- **Development Environment:** Single-port development with Vite + Express integration.
- **Production Readiness:** Dedicated build and run commands for production deployment.
- **Data Model:** Comprehensive Supabase schema with RLS policies and indexes, including extended profile fields.
- **Security:** Global `authMiddleware`, explicit role checks, and service-role Supabase client usage after identity verification.
- **Monorepo Structure:** Clear separation of concerns, originally part of a monorepo.
- **OAuth Client Registry:** Pre-registered trusted clients like `aethex_corp` and `aethex_studio`.
- **CORS Configuration:** Explicit allowed origins for production and development, with credentials enabled.

## Governance & Treasury

### DAO Contracts (Polygon Mainnet)
- **AethexToken ($AETHEX):** Deployed on Polygon mainnet
- **AethexTimelock:** Controls execution of passed proposals
- **AethexGovernor:** OpenZeppelin Governor implementation

### Tally.xyz Integration
The DAO is integrated with Tally.xyz for governance UI, analytics, and proposal management.

### Ledger Wallet Setup for Tally Governance
To participate in governance with a Ledger hardware wallet:

1. **Connect Ledger to MetaMask:**
   - Open MetaMask → Settings → Connect Hardware Wallet → Ledger
   - Unlock Ledger and open Ethereum app
   - Select account (Ledger address: `0x9A58610d3ad7A7399a4b9c5Dad440dA67FDE4DeF`)

2. **Delegate Voting Power on Tally:**
   - Go to tally.xyz and connect MetaMask (with Ledger)
   - Navigate to AeThex DAO page
   - Click "Delegate" and either self-delegate or delegate to another address
   - Sign the delegation transaction on Ledger

3. **Treasury Holdings:**
   - 1,000,000 AETHEX tokens held in Ledger wallet
   - Voting power requires delegation (self or to representative)

## Cross-Domain SSO Bridge

The OAuth session bridge syncs Supabase access tokens to cookies for server-side auth:
- Cookie: `sb-access-token` with Path=/, SameSite=Lax, Secure (HTTPS), max-age 1h
- Resolves cross-domain SSO login loops between aethex.foundation and client properties
- Server-side auth middleware reads this cookie to validate OAuth flows

## External Dependencies

- **Supabase:** User authentication, database management, and backend services.
- **Nodemailer:** Email sending functionality.
- **Tally.xyz:** Integrated for DAO governance functionalities and analytics.
- **Freename:** API for .aethex subdomain minting and resolution.