# Phase 1 Migration Status: Mainsite → Foundation
## Foundation vs Mainsite Code Comparison

**Last Updated:** November 17, 2025  
**Mission:** Migrate Discord OAuth & identity code from aethex.dev to aethex.foundation

---

## ✅ ALREADY COMPLETE ON FOUNDATION

### Authentication System (Phase 2 & 3)
| Component | Status | Notes |
|-----------|--------|-------|
| `/signup` | ✅ Complete | Email/password signup with OAuth options |
| `/login` | ✅ Complete | Supabase auth with OAuth provider buttons |
| `/onboarding` | ✅ Complete | 3-step flow (username, profile, review) |
| `AuthContext.tsx` | ✅ Complete | Supabase session management (needs Discord linkProvider) |
| `Dashboard.tsx` | ✅ Complete | User dashboard (needs OAuthConnections tab) |

### OAuth Provider System (Phase 3)
| Endpoint | Status | Purpose |
|----------|--------|---------|
| `/api/oauth/authorize` | ✅ Complete | Foundation SSO authorization |
| `/api/oauth/token` | ✅ Complete | OAuth token exchange |
| `/api/oauth/userinfo` | ✅ Complete | User info endpoint (OpenID Connect) |

### Passport System (Phase 4)
| Feature | Status | Notes |
|---------|--------|-------|
| `/:username` | ✅ Complete | Public Passport profile pages |
| `/api/passport/:username` | ✅ Complete | Public profile API with achievement counts |
| SEO & OpenGraph | ✅ Complete | Twitter Card support for social sharing |

### UI Components & Infrastructure
| Component | Status |
|-----------|--------|
| All Radix UI components | ✅ Complete |
| Layout, LoadingScreen, ErrorBoundary | ✅ Complete |
| Tailwind config, global.css | ✅ Complete |
| Supabase environment variables | ✅ Complete |

---

## ❌ NEEDS MIGRATION FROM MAINSITE

### Discord OAuth API Endpoints (CRITICAL)
| File | Endpoint | Purpose | Priority |
|------|----------|---------|----------|
| `api/discord/oauth/start.ts` | `GET /api/discord/oauth/start` | Redirect to Discord authorization | **HIGH** |
| `api/discord/oauth/callback.ts` | `GET /api/discord/oauth/callback` | Handle Discord callback, link user | **HIGH** |
| `api/discord/verify-code.ts` | `POST /api/discord/verify-code` | Verify 6-digit code for linking | **HIGH** |
| `api/discord/link.ts` | `POST /api/discord/link` | Link Discord account by code | **HIGH** |
| `api/discord/sync-roles.ts` | `POST /api/discord/sync-roles` | Assign Discord roles after linking | MEDIUM |
| `api/discord/activity-auth.ts` | `POST /api/discord/activity-auth` | Activity token verification | LOW (Optional) |

### Discord UI Pages (CRITICAL)
| File | Purpose | Priority |
|------|---------|----------|
| `client/pages/DiscordVerify.tsx` | 6-digit verification code entry | **HIGH** |
| `client/pages/DiscordOAuthCallback.tsx` | Discord OAuth callback handler | **HIGH** |

### OAuth Components (CRITICAL)
| File | Purpose | Priority |
|------|---------|----------|
| `client/components/settings/OAuthConnections.tsx` | Provider cards (Discord, Google, GitHub) | **HIGH** |

### Contexts (MEDIUM)
| File | Purpose | Priority |
|------|---------|----------|
| `client/contexts/DiscordContext.tsx` | Discord state management | MEDIUM |
| `client/contexts/DiscordActivityContext.tsx` | Discord Activity SDK state | LOW (Optional) |

### Database Migrations (CRITICAL)
| File | Tables Created | Priority |
|------|----------------|----------|
| `supabase/migrations/20250107_add_discord_integration.sql` | `discord_links`, `discord_verifications`, `discord_role_mappings` | **HIGH** |

---

## 🔧 ADAPTATIONS REQUIRED

### 1. API Base URL Updates
**Current (Mainsite):** `VITE_API_BASE=https://aethex.dev`  
**Needed (Foundation):** `VITE_API_BASE=https://aethex.foundation`

### 2. Convert Vercel Functions → Express Routes
Mainsite uses Vercel serverless functions (`/api/*`)  
Foundation needs Express routes in `server/index.ts`

### 3. Discord OAuth App Configuration
**Update Discord Developer Portal:**
- Old redirect: `https://aethex.dev/api/discord/oauth/callback`
- New redirect: `https://aethex.foundation/api/discord/oauth/callback`

### 4. Import Path Updates
Update all import paths to match Foundation's directory structure:
```typescript
// Mainsite
import Layout from "@/components/Layout";

// Foundation (check existing structure)
import { Layout } from "@/components/Layout";
```

### 5. AuthContext Enhancement
**Add Discord linkProvider method:**
```typescript
// In AuthContext.tsx
const linkProvider = async (provider: 'discord' | 'google' | 'github') => {
  // Implementation needed
};
```

---

## 📊 MIGRATION CHECKLIST

### High Priority (Core Discord OAuth)
- [ ] Copy Discord OAuth API endpoints (6 files)
- [ ] Copy DiscordVerify.tsx page
- [ ] Copy DiscordOAuthCallback.tsx page
- [ ] Copy OAuthConnections.tsx component
- [ ] Run Discord database migration
- [ ] Update AuthContext with linkProvider method
- [ ] Update Dashboard with OAuthConnections tab
- [ ] Convert Vercel functions to Express routes
- [ ] Update Discord OAuth app redirect URI
- [ ] Test Discord OAuth flow end-to-end

### Medium Priority (Enhanced Features)
- [ ] Copy DiscordContext.tsx (optional)
- [ ] Copy discord/sync-roles endpoint
- [ ] Test role synchronization

### Low Priority (Optional)
- [ ] Copy DiscordActivityContext.tsx
- [ ] Copy discord/activity-auth endpoint

---

## 🎯 SUCCESS CRITERIA FOR PHASE 1

✅ Users can log in via Discord on aethex.foundation  
✅ Users can link Discord account from Dashboard  
✅ 6-digit verification code flow works  
✅ Discord OAuth callbacks complete without errors  
✅ OAuth provider cards display correctly in Dashboard  
✅ Discord user data saves to `discord_links` table  
✅ All Supabase queries work correctly

---

## ⏱️ ESTIMATED TIME

| Task Category | Estimated Hours |
|---------------|-----------------|
| Copy & adapt API endpoints | 3-4 hours |
| Copy & adapt UI pages/components | 2-3 hours |
| Database migration | 1 hour |
| AuthContext enhancement | 1-2 hours |
| Testing & debugging | 2-3 hours |
| **TOTAL PHASE 1** | **9-13 hours** |

*(Reduced from original 17-25 hour estimate since Foundation already has auth system)*

---

## 📝 NOTES

**Why Phase 1 is shorter than expected:**
- Foundation already has complete Signup/Login/Onboarding (Phase 2)
- Foundation already has OAuth provider system (Phase 3)
- Foundation already has Passport system (Phase 4)
- We only need to add Discord-specific OAuth integration
- No need to migrate ThemeContext (Foundation uses next-themes)
- No need to migrate ErrorBoundary, LoadingScreen, Layout (already exist)

**Next Steps After Phase 1:**
- Phase 2: Supabase permission migration (Foundation gets full write access)
- Phase 3: Reroute aethex.dev login → aethex.foundation (SSO)
