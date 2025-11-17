# Guardian's Hub (AeThex Foundation)

## Overview

Guardian's Hub is the official AeThex Foundation website, designed to operate as a standalone platform. It features a public-facing "Trust Billboard" with information about the Foundation, and a private "Hub" experience for logged-in users, offering access to protocol documentation, governance features, and a community bounty board. The project's vision is to provide a dedicated, secure, and branded online presence for the AeThex Foundation.

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
- **Authentication:** Supabase for user authentication; account creation and onboarding are handled externally by `https://aethex.dev/onboarding`.
- **Email Functionality:** Nodemailer for email services.
- **Routing:**
    - **Public Pages (Trust Billboard):**
        - `/` - Foundation homepage
        - `/about` - Foundation mission & Axiom Model
        - `/ethics-council` - Ethics Council roster
        - `/contact` - Contact form
    - **Hub Pages (Logged-in Experience):**
        - `/hub` - Community dashboard landing page
        - `/hub/protocol` - Protocol documentation & whitepaper
        - `/hub/governance` - DAO governance integration (Tally.xyz)
        - `/hub/community` - Community bounty board & collaboration

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

### November 17, 2025 - Removed Onboarding Logic & Made Foundation Page Accessible
- **Removed All Onboarding Logic**:
  - Removed onboarding redirects from Login.tsx (now redirects to /dashboard only)
  - Cleaned up AuthContext.tsx - removed localStorage onboarding flags
  - Removed profile completion synchronization with localStorage
  - Login flow now redirects authenticated users directly to /dashboard
  - OAuth and Web3 login flows updated to redirect to /dashboard
- **Made /foundation Page Accessible**:
  - Added "Foundation" link to public navigation menu
  - Page displays Foundation mission, open-source projects, workshops, and resources
  - Visible to all visitors (not hidden behind authentication)
- **Context**: Guardian's Hub is login-only. All account creation and onboarding handled by main AeThex site (https://aethex.dev/onboarding)
- **Result**: Cleaner authentication flow, no duplicate onboarding logic, Foundation info easily accessible

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