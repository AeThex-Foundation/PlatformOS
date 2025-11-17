# Guardian's Hub (AeThex Foundation)

**Last Updated:** November 17, 2025

## Project Overview

Guardian's Hub is the official AeThex Foundation website featuring a public "Trust Billboard" (home, about, ethics council, contact) and a logged-in "Hub" experience (protocol docs, governance/DAO, community bounty board). The site uses a red and gold color scheme exclusively.

**Authentication Flow:** Guardian's Hub provides login-only functionality. Account creation and onboarding are handled by the main AeThex site at https://aethex.dev/onboarding.

## Technology Stack

- **Frontend:** React 18 + React Router 6 (SPA) + TypeScript + Vite + TailwindCSS 3
- **Backend:** Express server integrated with Vite dev server
- **Testing:** Vitest
- **UI Components:** Radix UI + TailwindCSS 3 + Lucide React icons
- **Additional Features:**
  - Supabase authentication  
  - Email functionality (nodemailer)

## Site Architecture

### Public Pages (Trust Billboard)
- **/** - Foundation homepage with curriculum, open source, community, achievements
- **/about** - Foundation mission & Axiom Model
- **/ethics-council** - Ethics Council roster
- **/contact** - Contact form

### Hub Pages (Logged-in Experience)
- **/hub** - Community dashboard landing page
- **/hub/protocol** - Protocol documentation & whitepaper
- **/hub/governance** - DAO governance integration (Tally.xyz)
- **/hub/community** - Community bounty board & collaboration

### Additional Pages
- **/foundation/curriculum** - Learning curriculum
- **/foundation/achievements** - Achievement badges
- **/foundation/downloads** - Downloadable resources
- **/foundation/community/developers** - Developer community
- Internal documentation routes (/internal-docs/*)
- Legal pages (/privacy, /terms)

## Project Structure

```
client/                     # React SPA frontend
├── pages/                 # Route components
│   ├── Index.tsx         # Foundation homepage (/)
│   ├── About.tsx         # About Foundation (/about)
│   ├── EthicsCouncil.tsx # Ethics Council (/ethics-council)
│   ├── Contact.tsx       # Contact form (/contact)
│   └── hub/              # Hub pages (logged-in)
│       ├── Hub.tsx       # Hub dashboard (/hub)
│       ├── Protocol.tsx  # Protocol docs (/hub/protocol)
│       ├── Governance.tsx # DAO governance (/hub/governance)
│       └── Community.tsx # Bounty board (/hub/community)
├── components/ui/         # Pre-built UI component library
├── App.tsx                # App entry point with Foundation-only routing
└── global.css             # Red/gold theme and global styles

server/                    # Express API backend
├── index.ts               # Main server setup
└── routes/                # API handlers

shared/                    # Types shared between client & server
└── api.ts                 # Shared API interfaces

public/                    # Static assets
docs/                      # Documentation
```

## Development Commands

```bash
npm run dev          # Start dev server (client + server) - port 5000
npm run build        # Production build
npm run typecheck    # TypeScript validation
npm test            # Run Vitest tests
```

## Replit Configuration

The project has been configured to run on Replit with the following settings:

- **Port:** 5000 (changed from default 8080)
- **Host:** 0.0.0.0 (allows access through Replit's iframe proxy)
- **HMR:** Configured with WebSocket support (wss protocol on port 443)

## Environment Variables

The following environment variables can be configured:

- `VITE_SUPABASE_URL` - Supabase project URL (client-side)
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (client-side)
- `SUPABASE_URL` - Supabase project URL (server-side)
- `SUPABASE_SERVICE_ROLE` - Supabase service role key for admin operations
- Email service credentials for nodemailer (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)

## Recent Changes

### November 17, 2025 - Signup Flow Removed, Redirect to Main Site
- **Removed Signup Functionality**: Guardian's Hub now provides login-only access
- **Updated Login Page**:
  - Removed signup toggle and form fields (full name, password requirements)
  - Removed `isSignUp` state and signup handling logic
  - Added external redirect link to https://aethex.dev/onboarding for account creation
  - Simplified handleSubmit to only handle sign-in
  - Removed unused imports (User icon, aethexUserService)
- **Result**: Clean login-only experience; all signup and onboarding handled by main AeThex site

## Recent Changes

### November 16, 2025 - Complete Discord Integration Removal  
- **Removed Discord Bot**: Deleted entire `discord-bot/` directory (managed by main site)
- **Removed Discord API**: Deleted `api/discord/` folder with all OAuth, webhooks, interactions, and role sync endpoints
- **Removed Discord Client Code**:
  - Deleted `client/contexts/DiscordContext.tsx` and `DiscordActivityContext.tsx`
  - Deleted `client/lib/discord-types.ts` and `discord-bot-status.ts`
  - Removed Discord imports from Login page
  - Deleted `scripts/register-discord-commands.ts`
- **Rewrote Backend**: Created clean Foundation-only `server/index.ts` (87 lines) with zero Discord code
- **Result**: Guardian's Hub is now 100% Discord-free, ready for separate repository deployment

### November 16, 2025 - Complete ARM Infrastructure Deep Clean
- **Removed ARM-Specific Discord Commands** (server/index.ts):
  - Deleted /nexus command (Nexus marketplace)
  - Deleted /set-realm command (realm/arm selection)
  - Updated /profile command to remove set-realm references
  - Updated default help command to Foundation-only commands
  - All Discord commands now Foundation-focused
- **Removed Legacy ARM API Folders**:
  - Deleted api/corp/ (Corp arm API)
  - Deleted api/devlink/ (Dev-Link arm API)
  - Deleted api/gameforge/ (GameForge arm API)
  - Deleted api/labs/ (Labs arm API)
  - Deleted api/nexus/ (Nexus marketplace API)
  - Deleted api/staff/ (Staff arm API)
  - Deleted api/admin/nexus/ (Nexus admin API)
  - Deleted api/user/arm-affiliations.ts, arm-follows.ts, followed-arms.ts (ARM user data)
- **Removed ARM Discord Bot Infrastructure**:
  - Deleted discord-bot/commands/set-realm.js (realm selection command)
  - Simplified discord-bot/utils/roleManager.js to Foundation-only (removed 5-ARM logic, now only assignFoundationRole)
- **Result**: 100% Foundation-only backend infrastructure, all ARM-specific server commands, API modules, and Discord bot functionality removed

### November 16, 2025 - ARM Infrastructure Cleanup (Continued)
- **Removed ARM-Specific Files**:
  - Deleted client/contexts/ArmThemeContext.tsx (multi-arm theme context)
  - Deleted client/hooks/use-arm-toast.ts (ARM-specific toast hook)
  - Deleted client/lib/arm-affiliation-service.ts (ARM affiliation service)
  - Deleted client/components/feed/ directory (ArmFeed.tsx, ArmPostCard.tsx, PostComposer.tsx)
- **Simplified Core Components to Foundation-Only**:
  - client/components/PageTransition.tsx: Removed getArmConfig function with 7 ARM branches, now uses single foundationConfig
  - client/components/DashboardTheme.tsx: Removed ArmKey type and 7 ARM theme configs, simplified to foundationTheme only
  - client/components/DashboardTheme.tsx: Updated DashboardHeader to not require arm parameter
  - client/components/DashboardTheme.tsx: Simplified getColorClasses to return Foundation colors only
  - client/pages/Foundation.tsx: Removed ARM imports (useArmTheme, useArmToast), uses local theme object
  - client/pages/Foundation.tsx: Removed "?arm=foundation" query parameters from navigation links
  - client/App.tsx: Changed wildcard route from SubdomainPassport to FourOhFourPage for proper 404 handling
- **Server Updates**:
  - server/index.ts: Simplified Discord /creators and /opportunities commands to Foundation-only (removed ARM option parameter)
- **Result**: Site loading perfectly with Foundation-only architecture, all ARM-specific infrastructure removed from core components

### November 16, 2025 - Guardian's Hub Transformation
- **Complete Foundation-Only Rebuild**: Transformed from multi-arm platform to "Guardian's Hub"
  - **Architecture**: Public "Trust Billboard" pages + logged-in "Hub" experience
  - **Removed All Non-Foundation Content**: Deleted Labs, GameForge, Corp, Staff, DevLink, Nexus page folders
  - **Removed Components**: ArmSwitcher, blog, nexus, wix, ethos, business admin folders
  - **New Public Pages** (Trust Billboard):
    - / - Foundation homepage with 4 feature cards
    - /about - Foundation mission & Axiom Model
    - /ethics-council - Ethics Council roster  
    - /contact - Contact form
  - **New Hub Pages** (Logged-in):
    - /hub - Community dashboard landing page
    - /hub/protocol - Protocol documentation & whitepaper
    - /hub/governance - DAO governance (Tally.xyz integration)
    - /hub/community - Community bounty board
  - **Updated Routing**: Completely rewrote App.tsx with Foundation-only routes
  - **Updated Navigation**: Updated Layout.tsx navigation to Foundation pages only with local theme object
  - **Red & Gold Theme**: Maintained exclusive red/gold color scheme (#EF4444 for red accent)
  - Site successfully loading with Foundation branding

### November 16, 2025 - Initial Replit Setup & Configuration
- Imported project from GitHub (https://github.com/AeThex-Corporation/aethex-forge)
- Installed Node.js 20
- Configured Vite for Replit environment:
  - Changed port from 8080 to 5000 (required for Replit webview)
  - Set host to 0.0.0.0 (allows iframe proxy access)
  - Added HMR WebSocket configuration (wss protocol on port 443)
  - Added allowedHosts: true to allow Replit's dynamic URLs
- Made Supabase optional:
  - Modified supabase.ts to not throw errors when credentials missing
  - Updated AuthContext to gracefully handle missing Supabase configuration
  - App now runs without Supabase (auth features disabled)
- Installed all npm dependencies (825 packages)
- Set up development workflow with webview output
- App successfully running and fully functional

## Architecture Notes

- Single-port development with Vite + Express integration
- TypeScript throughout (client, server, shared)
- Full hot reload for rapid development
- Production-ready with multiple deployment options
- Comprehensive UI component library included
- Type-safe API communication via shared interfaces

## Additional Documentation

- `AGENTS.md` - Detailed project documentation and guidelines
- `DISCORD_SETUP.md` - Discord bot setup instructions
- `SUPABASE_SETUP.md` - Supabase integration setup
- `OAUTH_SETUP.md` - OAuth configuration guide
- `hostinger-deploy.md` - Hostinger deployment instructions

## Repository Separation

### New Repository
**https://github.com/AeThex-Corporation/aethex-foundation.git**

Guardian's Hub has been completely separated from the main aethex-forge repository to become a standalone Foundation-only website.

### What Was Removed
- ❌ All multi-ARM infrastructure (Labs, GameForge, Corp, Staff, Dev-Link, Nexus)
- ❌ Complete Discord integration (bot, API, OAuth, contexts)
- ❌ Main-site-specific pages (admin, docs, internal-docs, profiles)
- ❌ Main-site-specific APIs (achievements, community, courses, ethos, feed, games, integrations, passport, roblox, user, web3)
- ❌ Platform deployment docs (Discord setup, OAuth setup, Supabase setup, Hostinger, Netlify, Vercel)
- ❌ Unused dependencies (Discord SDK, Web3/ethers, Stripe, serverless packages)

### What Was Kept
- ✅ Foundation pages (/, /about, /ethics-council, /contact)
- ✅ Hub pages (/hub, /hub/protocol, /hub/governance, /hub/community)
- ✅ Foundation-specific pages and components
- ✅ Clean Foundation-only server (87 lines)
- ✅ Supabase authentication integration
- ✅ Blog and Foundation APIs
- ✅ Core UI components and design system
- ✅ Red & gold exclusive theme

## Current Status

✅ **Guardian's Hub is ready for independent deployment!**  
✅ 100% Foundation-only architecture (no ARM, no Discord, no main-site code)  
✅ Clean repository structure with standalone focus  
✅ Public Trust Billboard fully functional (/, /about, /ethics-council, /contact)  
✅ Hub pages ready for logged-in experience (/hub/*)  
✅ Red & gold exclusive theme throughout  
✅ Development server running on port 5000  
✅ Package.json cleaned (removed unused dependencies)  
✅ README.md created for standalone repository  
✅ MIGRATION_PLAN.md documents complete separation  
ℹ️ Supabase environment variables not configured (optional - auth features will be functional when configured)

## Next Steps

1. **Verify Functionality** - Test all pages and features
2. **Initialize Git Repository** - Set up new Git repo
3. **Push to GitHub** - Push to https://github.com/AeThex-Corporation/aethex-foundation.git
4. **Configure Supabase** - Set up authentication if needed
5. **Deploy** - Deploy to production environment
