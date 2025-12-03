# AeThex Passport Engine

## Overview
A multi-tenant identity system that serves creator profiles on `.aethex.me` domains and project showcases on `.aethex.space` domains. The engine routes traffic based on subdomain and renders the appropriate profile or project page.

## Current State
The application is fully functional with:
- **Supabase integration** - Connected to the AeThex ecosystem database
- API endpoints for fetching creators and projects
- Host-based routing detection
- Two distinct visual themes (Night Mode for creators, GameForge for projects)
- ClaimPassport 404 page for unclaimed usernames/projects

## Architecture

### Domain Routing
- `*.aethex.me` - Creator profiles (Night Mode theme)
- `*.aethex.space` - Project showcases (GameForge theme)
- Root domain - Landing page with preview options

### Supabase Tables (AeThex Ecosystem)
- **profiles** - User profiles with username, full_name, bio, social links
- **user_profiles** - Extended user data with badges and skills
- **projects** - Game/project showcases with title, description, status
- **project_team_members** - Links team members to projects

### API Endpoints
- `GET /api/creators` - List verified creators
- `GET /api/creators/:slug` - Get creator by username (subdomain slug)
- `GET /api/projects` - List all projects
- `GET /api/projects/:slug` - Get project with team members
- `GET /api/passport` - Auto-detect route type based on host header

### Themes
1. **Night Mode** (Creators) - Dark purple/neon aesthetic with verified badges
2. **GameForge** (Projects) - Green/pixel-inspired game showcase style

## Key Files
- `server/supabase.ts` - Supabase client configuration
- `server/supabaseStorage.ts` - Supabase storage layer with data mapping
- `server/routes.ts` - API endpoints and routing logic
- `client/src/pages/home.tsx` - Main page with routing logic
- `client/src/components/passport/` - Profile and showcase components
- `client/src/components/passport/ClaimPassport.tsx` - 404 claim page

## Environment Variables
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anon/public key

## Development
- Run `npm run dev` to start the development server
- Test creators: `/?preview=creator&slug=username`
- Test projects: `/?preview=project&slug=project-slug`

## DNS Configuration
To use with real domains:
1. Point `*.aethex.me` CNAME to your Replit deployment
2. Point `*.aethex.space` CNAME to your Replit deployment
3. The app will automatically detect the domain and serve the appropriate content
