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