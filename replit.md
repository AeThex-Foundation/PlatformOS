# Guardian's Hub (AeThex Foundation)

## Overview

Guardian's Hub is the official AeThex Foundation website and Passport Authentication Provider, acting as the "Government" for AeThex identities. It manages user onboarding, identity, and authentication for all AeThex properties. Key features include a blockchain-based governance system, a .aethex Passport Domain System, and comprehensive modules for mentorship, opportunities, project management (GameForge ARM), audio artist portfolios (Ethos Guild), and a rich multi-tenant Passport profile system.

## User Preferences

- The user wants iterative development.
- The user wants the agent to ask before making major changes.
- The user wants detailed explanations.
- The user prefers clean, functional code.
- The user wants the agent to use simple and clear language.
- The user wants the agent to strictly adhere to the red and gold color scheme.

## System Architecture

Guardian's Hub is a React 18, TypeScript, Vite, and TailwindCSS 3 Single Page Application (SPA) with an integrated Express backend.

### UI/UX Decisions
- **Color Scheme:** Red and gold theme (#EF4444 for red accent).
- **Component Library:** Radix UI components, styled with TailwindCSS 3.
- **Iconography:** Lucide React icons.
- **Design Approach:** Public "Trust Billboard" pages and private "Hub" pages post-login.

### Technical Implementations
- **Frontend:** React 18, React Router 6, TypeScript, Vite, TailwindCSS 3.
- **Backend:** Express server, integrated with Vite, utilizing `tsx`.
- **Authentication:** Supabase (AeThex Passport SSO provider) with OAuth 2.0 endpoints (PKCE support).
- **Email Functionality:** Nodemailer.
- **Blockchain Governance:** Hardhat, Solidity 0.8.24, OpenZeppelin Governor (AethexToken, AethexTimelock, AethexGovernor) on Polygon Mainnet and Sepolia Testnet.
- **Web3 Integration:** Custom governance UI with Wagmi v2 and Viem for wallet connection, proposal creation, and voting.
- **.aethex Passport Domain System:** Token-gated domain claiming (`username.aethex`) via Freename integration, including API for checks, claiming, and resolution.
- **Passport Engine (Multi-Tenant Profiles):** Host-based routing for creator profiles (`*.aethex.me`) and project showcases (`*.aethex.space`), dynamically rendering content based on subdomain and fetching enriched Supabase data.
- **Rich Passport System:** Full-featured profile pages with realm alignment, XP/Level progression, achievement badges, Ethos Guild integration, projects section, arm affiliations, follower stats, and social links.
- **Ethos Guild Integration:** Audio artist portfolio system with API endpoints, artist settings (skills, pricing), track library (upload, management), and secure Supabase storage.
- **GameForge ARM Dashboard:** Project management system for game development with CRUD APIs for projects, sprints, tasks, and team management.
- **Passport Hub (`/passport`):** Central management with member directory, passport customization, feature showcase, and admin dashboard (user management, verification).
- **Cross-Domain SSO:** AeThex Passport SDK for client site integration with PKCE, React support, automatic token refresh, secure storage, and a server-side OAuth session bridge for cookie-based authentication.
- **Admin System:** Comprehensive dashboard (`/admin`) with role-based access control, user management, mentor management, opportunity moderation, mentorship request oversight, endorsement moderation, and OAuth client management.
- **Donation System (`/donate`):** Platform with live stats, funding goals, gamified tiers, one-time mission funding, corporate sponsorship, activity feed, donor leaderboard, and crypto donations (MATIC/ETH/AETHEX).
- **Content Management:** Centralized for Foundation and Hub data (stats, team, milestones, resources).
- **Mentorship System (`/mentorship`):** Platform for program listings, mentor applications, profiles, and request flow.
- **Opportunities System (`/opportunities`):** Job/collaboration board with posting, search/filter, and application tracking.
- **Nexus - The Guild (`/nexus`):** Unified collective of AeThex creators (coders, artists, musicians, designers) with Ethos, Forge, and Visuals divisions. Includes a certified member directory (`/creators`).
- **TLD Hub - .aethex Domain System:** Integrated domain registration (`/tld`) with search, token-gated claiming, and a dashboard for managing claimed domains. Includes Agora governance (`/agora`) for DAO proposals and treasury, and Developer Grants (`/grants`) program.

### System Design Choices
- **Type Safety:** TypeScript for type-safe communication.
- **Development Environment:** Single-port development (Vite + Express).
- **Production Readiness:** Dedicated build and run commands.
- **Data Model:** Comprehensive Supabase schema with RLS and indexes.
- **Security:** Global `authMiddleware`, explicit role checks, and service-role Supabase client usage.
- **Monorepo Structure:** Originally part of a monorepo, maintaining clear separation of concerns.
- **OAuth Client Registry:** Pre-registered trusted clients.
- **CORS Configuration:** Explicit allowed origins with credentials enabled.

## External Dependencies

- **Supabase:** User authentication, database, and backend services.
- **Nodemailer:** Email sending.
- **Tally.xyz:** DAO governance UI, analytics, and proposal management.
- **Freename:** .aethex subdomain minting and resolution API.