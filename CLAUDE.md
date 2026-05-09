# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Guardian's Hub** is the official AeThex Foundation website (`aethex.foundation`). It serves as the identity and governance authority for the AeThex ecosystem. The core product is **AeThex Passport** — an authentication and identity layer for the broader AeThex ecosystem (Foundation, Corp, Studio/Labs).

The platform serves two audiences:
- **Public ("Trust Billboard")** — Foundation mission, creator directory, achievements, programs
- **Authenticated Hub** — Community tools, governance (Agora), Discord integration, admin panel

## Commands

```bash
# Development
npm run dev              # Start full-stack dev server (Vite + Express on port 5000)
npm run dev:foundation   # Foundation-specific dev mode (scripts/dev-foundation.sh)

# Build
npm run build            # Build client to dist/spa/

# Production
npm start                # Run production server via tsx server/index.ts

# Testing
npm test                 # Run vitest test suite (non-watch)
npm run typecheck        # TypeScript type check (tsc, no emit)
npm run format           # Prettier format all files

# Single test file
npx vitest run tests/creator-network-api.test.ts
```

CI runs `typecheck → build → test` on push/PR to `main`.

## Architecture

### Request Flow

In development, Vite (`vite.config.ts`) mounts the Express server as middleware via `expressPlugin()`, so a single dev server at port 5000 handles both the Vite HMR and Express API routes (`/api/*`). In production, `npm start` runs the Express server directly; it serves the pre-built `dist/spa/` directory for all non-API routes.

```
Browser → Vite (dev) / Express (prod)
              ├── /api/*  → Express route handlers (server/)
              └── /*      → React SPA (client/)
```

### Server (`server/`)

`server/index.ts` is the single Express entry point, `createServer()` wires all routes. The auth middleware (`server/middleware/auth.ts`) runs globally on every request — it validates a Supabase session token from the `Authorization: Bearer` header or the `sb-access-token` cookie and attaches `req.user` if valid, but does **not** block unauthenticated requests. Individual route handlers call `requireAuth()` for protected endpoints.

Two separate Supabase admin clients exist:
- `server/supabase.ts` → `adminSupabase` — general server-side operations
- `server/oauth/oauth-service.ts` → `supabaseAdmin` — OAuth provider operations (separate export)

Several route files (e.g., `profile-routes.ts`) create their own Supabase admin client inline rather than importing the shared one — this is an inconsistency to be aware of.

### OAuth 2.0 Provider (`server/oauth/`)

The Foundation runs a custom OAuth 2.0 Authorization Code flow (with PKCE, RFC 7636). This powers **Foundation Passport SSO** — external AeThex properties can authenticate users via `/api/oauth/authorize → /api/oauth/token → /api/oauth/userinfo`. OAuth clients are stored in Supabase and managed via `/api/oauth-clients` (user) and `/api/admin/oauth-clients` (admin).

### Subdomain Routing (Passport)

The client detects whether it's running on a wildcard subdomain:
- `*.aethex.me` → renders `PassportRouter` → shows creator profile (`CreatorProfile`)
- `*.aethex.space` → renders `PassportRouter` → shows project showcase (`ProjectShowcase`)

This detection happens in `isPassportSubdomain()` in `client/App.tsx` — the full SPA is bypassed and replaced with the subdomain view.

### Client (`client/`)

**Path aliases:**
- `@/` → `client/`
- `@shared/` → `shared/`

**Context providers** (outermost to innermost in `App.tsx`):
`QueryClientProvider` → `Web3Provider` → `AuthProvider` → `TooltipProvider`

**Auth** (`client/contexts/AuthContext.tsx`): Exposes `user`, `profile` (typed `AethexUserProfile`), `roles[]`, and `session`. The `profile` is fetched via `aethex-database-adapter.ts`, which wraps Supabase queries and normalizes the `user_profiles` table rows.

**Access control** uses `<RequireAccess>` component (`client/components/RequireAccess.tsx`), which checks `allowedRealms` against `profile.user_type` and `allowedRoles` against `roles[]` from AuthContext.

**Data fetching**: `@tanstack/react-query` for server state. API calls go to the same origin via relative paths (proxied by Vite in dev).

All pages are lazy-loaded via `React.lazy()` with a `<LoadingScreen />` fallback. Only `Index`, `Login`, `Signup`, and `404` are eagerly imported.

### Database (`client/lib/database.types.ts`)

Key tables: `user_profiles`, `achievements`, `user_achievements`, `applications`, `contact_messages`. SQL migrations live in `supabase/`. The `database.types.ts` is the generated Supabase type file — regenerate it with `supabase gen types typescript` when the schema changes.

### AeThex "Arms" (Divisions)

The platform has four organizational arms with distinct feature areas:
- **GAMEFORGE** — project/sprint/task management (`/gameforge`, `server/routes/gameforge-routes.ts`)
- **ETHOS** — audio portfolio and licensing for artists (`/ethos`, `server/routes/ethos-routes.ts`)
- **LABS** — open source / experiments (referenced in profiles)
- **FOUNDATION** — governance, grants, donations, curriculum

User profiles carry `arms: string[]` to track affiliation. The `ArmSwitcher` component and `ArmThemeContext` handle arm-specific theming.

### Blog Content

Blog posts can come from two sources, merged in `api/blog/index.ts`: **Ghost CMS** (if `GHOST_API_URL` and `GHOST_CONTENT_API_KEY` are set) and **Supabase** (`blog_posts` table). Ghost takes precedence per post.

## Key Conventions

**TypeScript**: `strict` mode is **off**; `noImplicitAny` and `strictNullChecks` are also off. Do not tighten these without a full audit — many existing patterns rely on this.

**Styling**: TailwindCSS with CSS custom properties for theming (HSL values). The theme is dark-mode-first. Use `cn()` from `client/lib/utils.ts` (`clsx` + `tailwind-merge`) for conditional classes. UI primitives come from shadcn/ui (Radix + Tailwind) in `client/components/ui/`.

**CORS**: In production, only explicit origins in `ALLOWED_ORIGINS` plus `*.aethex.me`, `*.aethex.space`, and Replit/Codespaces preview domains are allowed. In development, all origins are permitted.

**Adding a new API route**: Create `server/routes/<name>-routes.ts`, export a Router, import and mount it in `server/index.ts`. Follow the pattern: public GETs at the top of `createServer()`, auth-required routes below.

**Web3**: `wagmi` + `viem` + `@rainbow-me/rainbowkit` handle wallet connections. Config is in `client/lib/wagmi.ts`. Wallet connect UI is in `client/components/WalletConnect.tsx`.

## Environment Variables

See `.env.example` for the full list. Required for full functionality:

| Variable | Used by |
|---|---|
| `VITE_SUPABASE_URL` | Client Supabase init |
| `VITE_SUPABASE_ANON_KEY` | Client Supabase init |
| `SUPABASE_SERVICE_ROLE` | Server admin Supabase client |
| `JWT_SECRET` | OAuth token signing (required in production) |
| `STRIPE_SECRET_KEY` | Donations / payments |
| `DISCORD_CLIENT_ID/SECRET/BOT_TOKEN/GUILD_ID` | Discord OAuth integration |
| `SMTP_*` | Nodemailer email service |
| `GHOST_API_URL` / `GHOST_CONTENT_API_KEY` | Blog content (optional) |
