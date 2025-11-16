# Guardian's Hub - Repository Migration Plan

## Objective
Separate Guardian's Hub (AeThex Foundation website) from the main aethex-forge repository into a standalone repository at:
**https://github.com/AeThex-Corporation/aethex-foundation.git**

---

## Files to KEEP (Guardian's Hub - Foundation-only)

### Core Application
- ✅ `index.html` - Entry point
- ✅ `vite.config.ts` - Vite configuration
- ✅ `vite.config.server.ts` - Server integration
- ✅ `tailwind.config.ts` - Styling
- ✅ `tsconfig.json` - TypeScript config
- ✅ `postcss.config.js` - PostCSS config
- ✅ `components.json` - shadcn/ui config
- ✅ `package.json` - Dependencies (will be cleaned)
- ✅ `.gitignore`
- ✅ `.prettierrc`
- ✅ `replit.md` - Project documentation

### Client (Frontend)
- ✅ `client/` - Core React application
- ✅ `client/pages/Index.tsx` - Foundation homepage
- ✅ `client/pages/About.tsx` - Foundation mission
- ✅ `client/pages/Contact.tsx` - Contact form
- ✅ `client/pages/EthicsCouncil.tsx` - Ethics Council
- ✅ `client/pages/Foundation.tsx` - Foundation main page
- ✅ `client/pages/Login.tsx` - Authentication (Supabase)
- ✅ `client/pages/404.tsx` - Error page
- ✅ `client/pages/Privacy.tsx` - Privacy policy
- ✅ `client/pages/Terms.tsx` - Terms of service
- ✅ `client/pages/hub/` - Hub pages (Protocol, Governance, Community)
- ✅ `client/pages/foundation/` - Foundation-specific pages
- ✅ `client/components/` - All UI components
- ✅ `client/contexts/` - React contexts (Auth, etc.)
- ✅ `client/hooks/` - Custom hooks
- ✅ `client/lib/` - Utility libraries
- ✅ `client/global.css` - Global styles
- ✅ `client/App.tsx` - Main app routing
- ✅ `client/main.tsx` - React entry point

### Server (Backend)
- ✅ `server/index.ts` - Clean Foundation-only Express server
- ✅ `server/supabase.ts` - Supabase admin client
- ✅ `server/email.ts` - Email service

### API Endpoints
- ✅ `api/blog/` - Foundation blog
- ✅ `api/foundation/` - Foundation-specific APIs
- ✅ `shared/` - Shared TypeScript types

### Database
- ✅ `supabase/` - Supabase migrations and config (Foundation auth)

### Assets
- ✅ `public/` - Static assets
- ✅ `attached_assets/` - Generated images/assets

---

## Files to REMOVE (Main-site-specific)

### Pages to Remove
- ❌ `client/pages/admin/` - Multi-ARM admin panel
- ❌ `client/pages/community/` - Multi-ARM community features
- ❌ `client/pages/docs/` - General platform docs (not Foundation)
- ❌ `client/pages/internal-docs/` - AeThex internal docs
- ❌ `client/pages/profile/` - General user profiles
- ❌ `client/pages/Dashboard.tsx` - Multi-ARM dashboard
- ❌ `client/pages/DevelopersDirectory.tsx` - Platform-wide directory
- ❌ `client/pages/Profile.tsx` - General profiles
- ❌ `client/pages/ProfilePassport.tsx` - Multi-ARM passport
- ❌ `client/pages/SubdomainPassport.tsx` - Subdomain routing
- ❌ `client/pages/LegacyPassportRedirect.tsx` - Legacy redirects
- ❌ `client/pages/SignupRedirect.tsx` - Platform redirects
- ❌ `client/pages/ResetPassword.tsx` - Platform auth (using Supabase built-in)
- ❌ `client/pages/Placeholder.tsx` - Development placeholder

### API Endpoints to Remove
- ❌ `api/achievements/` - Multi-platform achievements
- ❌ `api/admin/` - Admin panel APIs
- ❌ `api/community/` - Multi-ARM community
- ❌ `api/courses/` - Platform courses
- ❌ `api/ethos/` - Multi-ARM ethos system
- ❌ `api/feed/` - Multi-ARM social feed
- ❌ `api/games/` - GameForge games
- ❌ `api/integrations/` - Platform integrations
- ❌ `api/passport/` - Multi-ARM passport
- ❌ `api/profile/` - General profiles
- ❌ `api/roblox/` - Roblox OAuth integration
- ❌ `api/user/` - General user management
- ❌ `api/web3/` - Web3/Ethereum integration
- ❌ `api/applications.ts` - Platform applications
- ❌ `api/creators.ts` - Platform creators
- ❌ `api/devconnect-links.ts` - DevConnect
- ❌ `api/interests.ts` - Platform interests
- ❌ `api/opportunities.ts` - Platform opportunities
- ❌ `api/roblox-callback.ts` - Roblox callback
- ❌ `api/sync-docs-gitbook.ts` - GitBook sync

### Documentation & Config to Remove
- ❌ `docs/` - General platform documentation
- ❌ `docs-migration/` - Migration docs
- ❌ `DISCORD_SETUP.md` - Discord bot setup (main site)
- ❌ `OAUTH_SETUP.md` - Platform OAuth setup
- ❌ `SUPABASE_SETUP.md` - Platform Supabase setup
- ❌ `AGENTS.md` - Platform agent docs
- ❌ `hostinger-deploy.md` - Hostinger deployment
- ❌ `netlify.toml` - Netlify config
- ❌ `vercel.json` - Vercel config
- ❌ `.htaccess` - Apache config
- ❌ `.dockerignore` - Docker config
- ❌ `.vercelignore` - Vercel ignore
- ❌ `.env.discord.example` - Discord env example
- ❌ `supabase-migration.sql` - Platform migration SQL
- ❌ `build-api.js` - Build script
- ❌ `build-for-hostinger.sh` - Hostinger build
- ❌ `copy-api.js` - API copy script

### Tests & Scripts to Review
- ⚠️ `tests/` - Review and keep Foundation-relevant tests only
- ⚠️ `scripts/` - Review and keep Foundation-relevant scripts only

---

## Package Cleanup

### Dependencies to Remove
- `@discord/embedded-app-sdk` - Discord integration (main site)
- Stripe integration (if not used by Foundation)
- Ethereum/Web3 packages (ethers.js) if not used
- Roblox-specific packages

### Dependencies to Keep
- React + React Router
- Vite + Tailwind
- Supabase client
- Radix UI components
- Three.js + React Three Fiber (if used)
- Email service (nodemailer)

---

## Next Steps

1. ✅ Remove all identified folders/files
2. ✅ Clean up package.json dependencies
3. ✅ Create standalone README.md for Guardian's Hub
4. ✅ Update .gitignore for Foundation-only project
5. ✅ Test site functionality
6. ✅ Initialize new Git repository
7. ✅ Push to https://github.com/AeThex-Corporation/aethex-foundation.git

---

**Status:** Ready for cleanup phase
