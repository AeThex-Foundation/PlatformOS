# Creator Directory Implementation

## Overview
The Creator Directory is a privacy-first "Hall of Fame" page at `/creators` that showcases the Foundation's community members. This feature implements a **opt-out by default** system where users must explicitly enable their profile visibility.

## Architecture

### Database Schema Extensions
Added to `user_profiles` table (requires manual SQL execution in Supabase Dashboard):

```sql
-- See SUPABASE-ADD-CREATOR-FIELDS.sql for full migration
ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS show_in_creator_directory BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS arms TEXT[],
  ADD COLUMN IF NOT EXISTS roles TEXT[],
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_directory 
  ON user_profiles(show_in_creator_directory, last_active_at DESC);
```

**Key Fields:**
- `show_in_creator_directory` (boolean, default FALSE): Privacy-first opt-in control
- `arms` (text[]): Multi-affiliation support (GAMEFORGE, ETHOS, LABS, FOUNDATION)
- `roles` (text[]): Role tags (Architect, Mentor, Community Member)
- `last_active_at` (timestamp): For "Recently Active" sorting

### Backend API

**Endpoint:** `GET /api/creators`

**Query Parameters:**
- `arm` (string, optional): Filter by specific arm (e.g., "GAMEFORGE")
- `role` (string, optional): Filter by role (e.g., "Architect")
- No authentication required (public endpoint)

**Response:**
```json
[
  {
    "id": "...",
    "username": "johndoe",
    "full_name": "John Doe",
    "avatar_url": "https://...",
    "bio": "Full-stack developer...",
    "arms": ["GAMEFORGE", "LABS"],
    "roles": ["Architect"],
    "level": 5,
    "total_xp": 1250,
    "badge_count": 3,
    "location": "San Francisco, CA",
    "social_links": {...},
    "joined_at": "2024-01-15T..."
  }
]
```

**Privacy Rules:**
- Only returns profiles where `show_in_creator_directory = true`
- Requires complete profile (avatar, username, bio)
- Public data only (no email, no private stats)
- 5-minute response caching for performance

### Profile Management API

**Endpoint:** `POST /api/profile/creator-directory`

**Request:**
```json
{
  "show_in_directory": true
}
```

**Validation:**
- Requires authentication (Supabase session token)
- Checks profile completeness (avatar, username, bio required)
- Returns error if profile incomplete
- Updates `last_active_at` timestamp

**Response:**
```json
{
  "success": true,
  "show_in_directory": true,
  "message": "You are now visible in the Creator Directory"
}
```

## Frontend Implementation

### Creator Directory Page (`/creators`)

**Sections:**
1. **Featured Architects** (Horizontal Scroll)
   - Only shows profiles with "Architect" role
   - Prominent display with larger cards
   - Auto-scrolls on larger screens

2. **Full Community Directory** (Grid)
   - All visible creators
   - Sortable by "Recently Active" or "Newest Members"
   - Filterable by Arm and Role (multi-select dropdowns)

**Creator Card Design:**
- Avatar (circular, centered)
- Full name + username
- Bio (truncated)
- Arm tags (color-coded badges)
- Architect badge (🛡️ if applicable)
- Stats: Level, XP, Badges
- Location + social links
- "View Profile" button → `/:username`

**Arm Color Coding:**
- 🎮 GAMEFORGE: Blue (`border-blue-500/50`)
- ⚖️ ETHOS: Purple (`border-purple-500/50`)
- 🔬 LABS: Green (`border-green-500/50`)
- 🏛️ FOUNDATION: Red (`border-red-500/50`)

### Dashboard Settings Integration

**Location:** Dashboard → Settings Tab → "Public Visibility" section

**Features:**
- Toggle switch for Creator Directory visibility
- Real-time profile completeness validation
- Shows green "Visible" badge when enabled
- Shows amber warning if profile incomplete
- Link to Creator Directory when visible
- Toast notifications for success/error states
- Optimistic UI updates

**Profile Requirements:**
- ✅ Avatar uploaded
- ✅ Username set
- ✅ Bio written

## User Experience

### Privacy-First Design
1. **Default: Hidden** - New users are NOT shown in directory
2. **Explicit Opt-In** - Users must actively enable visibility
3. **Profile Completeness Check** - Cannot enable without avatar/username/bio
4. **Easy Opt-Out** - Single toggle to disable visibility
5. **No Surprise Exposure** - Clear messaging about what's public

### User Flow

**Enabling Directory Visibility:**
```
1. User goes to Dashboard → Settings
2. Sees "Show in Creator Directory" toggle (default: OFF)
3. If profile incomplete → Toggle fails with error message
4. User completes profile (avatar, username, bio)
5. User enables toggle → Success toast
6. Profile appears in /creators within seconds
```

**Viewing Directory:**
```
1. Visit /creators (public page, no login required)
2. See Featured Architects section
3. Scroll to Full Directory
4. Filter by Arm (GAMEFORGE, ETHOS, etc.)
5. Filter by Role (Architect, Mentor, etc.)
6. Click "View Profile" → Go to /:username
```

## Security & Privacy

### Public Data Only
The Creator Directory exposes:
- ✅ Username, full name, avatar
- ✅ Bio, location, social links
- ✅ Level, XP, badge count
- ✅ Arm affiliations, roles
- ❌ Email address (never exposed)
- ❌ Private stats, achievements
- ❌ OAuth connections (Discord, etc.)

### Authentication
- `/api/creators` - No auth required (public)
- `/api/profile/creator-directory` - Requires Supabase session token
- Token validated via `authMiddleware` (checks session, attaches `req.user`)

### Rate Limiting
- Response caching (5 minutes)
- Index on `show_in_creator_directory` + `last_active_at`
- Limits payload size (public fields only)

## Technical Decisions

### Why Opt-Out by Default?
- **Privacy First**: Users should control their visibility
- **GDPR Compliance**: Explicit consent for public display
- **No Surprises**: Users know exactly what's public

### Why Multi-Arm Support?
- Users can contribute to multiple Arms simultaneously
- Reflects real-world project collaboration
- Shows cross-functional expertise

### Why Separate Featured Architects?
- Highlights senior contributors
- Mentorship visibility
- Encourages architecture participation

### Why "Recently Active" Sort?
- Shows current engagement
- Encourages regular contribution
- Auto-updates `last_active_at` on profile changes

## Migration Checklist

Before deploying to production:

- [ ] Run `SUPABASE-ADD-CREATOR-FIELDS.sql` migration on Supabase Dashboard
- [ ] Verify index created: `idx_user_profiles_directory`
- [ ] Test opt-in flow (incomplete profile → complete → enable)
- [ ] Test opt-out flow (disable toggle, verify removal from directory)
- [ ] Verify filtering (by Arm, by Role)
- [ ] Verify sorting (Recently Active, Newest)
- [ ] Check response caching (5-minute TTL)
- [ ] Test privacy (ensure no email/OAuth data exposed)
- [ ] Verify redirect to Passport profiles (`/:username` links work)

## Future Enhancements

### Phase 2 (Potential)
- Search functionality (by name, username, skills)
- Skill tags (beyond Arm affiliations)
- "Hire Me" toggle for freelancers
- Direct messaging integration
- Endorsements / recommendations

### Phase 3 (Potential)
- Creator leaderboards
- Contribution graphs
- Project showcases
- Team formation tools

## Files Modified

### Backend
- `server/routes/creators-routes.ts` - Creator Directory API
- `server/routes/profile-routes.ts` - Profile management API (NEW)
- `server/index.ts` - Route registration

### Frontend
- `client/pages/Creators.tsx` - Creator Directory page
- `client/pages/Dashboard.tsx` - Settings toggle integration
- `client/lib/aethex-database-adapter.ts` - Type definitions
- `client/App.tsx` - Route registration

### Database
- `SUPABASE-ADD-CREATOR-FIELDS.sql` - Migration script (manual execution)

### Documentation
- `replit.md` - Updated project memory
- `CREATOR-DIRECTORY-IMPLEMENTATION.md` - This file

## Testing Strategy

### Manual Testing
1. **Privacy Test**: Verify new users default to hidden
2. **Validation Test**: Try enabling with incomplete profile
3. **Toggle Test**: Enable/disable multiple times
4. **Filter Test**: Test all Arm/Role combinations
5. **Sort Test**: Verify "Recently Active" vs "Newest"
6. **Link Test**: Click "View Profile" → Verify Passport page loads

### Edge Cases
- User with no arms/roles → Should still appear if opted-in
- User with multiple arms → All tags displayed
- User without avatar → Cannot enable directory
- User deletes bio → Should auto-disable directory visibility

## Performance Considerations

- **Response Caching**: 5-minute TTL reduces database load
- **Indexed Queries**: `idx_user_profiles_directory` speeds up lookups
- **Payload Size**: Only return essential fields (no full profile data)
- **Pagination**: Consider adding if directory exceeds 100 users

## Notes

- All Arm/Role values stored as TEXT[] for multi-affiliation support
- Arm names are case-sensitive (GAMEFORGE, ETHOS, LABS, FOUNDATION)
- Role names are case-sensitive (Architect, Mentor, Community Member)
- `last_active_at` auto-updates on profile changes (including directory toggle)
- Featured Architects section filters by exact match: `roles @> ARRAY['Architect']`
