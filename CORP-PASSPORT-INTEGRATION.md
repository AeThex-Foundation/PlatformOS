# Corp Integration: How aethex.dev Users See Foundation Passports

## 🎫 The Passport System After Integration

Once **aethex.dev** integrates with **aethex.foundation** OAuth, here's how Corp users will experience Foundation Passports:

---

## 🔄 Integration Flow

### **Scenario 1: New User Signup on aethex.dev**

```
User visits: https://aethex.dev
              ↓
Clicks: "Sign Up" or "Login"
              ↓
Redirected to: https://aethex.foundation/login
              ↓
User chooses: Discord / Email / GitHub / Google
              ↓
Foundation creates: Passport profile with username
              ↓
Foundation redirects back with: OAuth code
              ↓
Corp exchanges code for: Access token
              ↓
Corp fetches: User profile from Foundation
              ↓
User is now logged into aethex.dev ✅
```

**Result:**
- User has ONE identity: Their Foundation Passport
- Corp stores: User ID + Foundation access token
- Corp displays: Username, avatar, bio from Foundation

---

## 👤 How Corp Displays Passport Data

### **Option A: Embedded Profile Card** (Recommended)

Corp can embed Foundation profile data directly in their UI:

```tsx
// On aethex.dev - User Profile Component
function UserProfile() {
  const { user } = useAuth(); // From Foundation OAuth
  
  return (
    <div className="profile-card">
      <img src={user.avatar_url} alt={user.username} />
      <h2>{user.full_name}</h2>
      <p>@{user.username}</p>
      <p>{user.bio}</p>
      
      {/* Link to full Passport */}
      <a 
        href={`https://aethex.foundation/${user.username}`}
        target="_blank"
      >
        View Full Passport →
      </a>
    </div>
  );
}
```

**Data Available to Corp:**
```json
{
  "sub": "uuid-from-foundation",
  "username": "alice",
  "full_name": "Alice Developer",
  "email": "alice@example.com",
  "avatar_url": "https://cdn.supabase.co/...",
  "bio": "Game developer and open source contributor",
  "level": 5,
  "total_xp": 2400,
  "badge_count": 12,
  "verified": false
}
```

---

### **Option B: Direct Link to Foundation Passport** (Simple)

Corp can simply link to Foundation for full profiles:

```tsx
// On aethex.dev - User Card Component
function UserCard({ username }) {
  return (
    <a 
      href={`https://aethex.foundation/${username}`}
      className="user-link"
    >
      <Avatar username={username} />
      <span>@{username}</span>
    </a>
  );
}
```

**User clicks** → Opens Foundation Passport in new tab → Sees full profile

---

### **Option C: Iframe Embed** (Advanced)

Corp can embed the entire Passport profile in an iframe:

```tsx
// On aethex.dev - Full Profile Page
function FoundationPassportEmbed({ username }) {
  return (
    <div className="passport-embed">
      <iframe
        src={`https://aethex.foundation/${username}?embed=true`}
        width="100%"
        height="600px"
        frameBorder="0"
      />
      <a href={`https://aethex.foundation/${username}`}>
        View on Foundation →
      </a>
    </div>
  );
}
```

---

## 🎨 Visual Examples

### **Corp Dashboard - User Dropdown**

```
┌─────────────────────────────┐
│ 👤 Alice Developer          │
│    @alice                   │
├─────────────────────────────┤
│ 📊 Dashboard                │
│ ⚙️  Settings                │
│ 🎫 My Passport →            │ ← Links to Foundation
│ 🚪 Logout                   │
└─────────────────────────────┘
```

When user clicks **"My Passport"**:
- Opens: `https://aethex.foundation/alice`
- Shows: Full public Passport with badges, achievements, social links

---

### **Corp Project Page - Author Credit**

```
┌────────────────────────────────────┐
│ Project: AetherEngine             │
│ By: @alice                         │ ← Clickable
│     Level 5 • 12 badges            │
└────────────────────────────────────┘
```

Click **"@alice"** → Opens Foundation Passport

---

### **Corp Community Page - User Grid**

```
┌────────┬────────┬────────┐
│ 👤     │ 👤     │ 👤     │
│ @alice │ @bob   │ @carol │
│ Lvl 5  │ Lvl 3  │ Lvl 8  │
└────────┴────────┴────────┘
        ↓ Click
https://aethex.foundation/alice
```

---

## 🔗 Deep Linking Examples

### **Link Formats Corp Can Use:**

```bash
# Basic profile
https://aethex.foundation/alice

# With referral tracking
https://aethex.foundation/alice?ref=aethex_corp

# Specific section (future)
https://aethex.foundation/alice#achievements
https://aethex.foundation/alice#projects
https://aethex.foundation/alice#activity
```

---

## 📊 API Integration

### **Corp Backend - Fetch User Data**

```typescript
// Corp server - Get Foundation user data
async function getFoundationUser(accessToken: string) {
  const response = await fetch(
    'https://aethex.foundation/api/oauth/userinfo',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  const user = await response.json();
  
  // Store in Corp database
  await db.users.upsert({
    foundation_id: user.sub,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url,
    full_name: user.full_name,
    // ... sync other fields
  });
  
  return user;
}
```

### **Corp API - Public Profile Lookup**

```typescript
// Corp can fetch ANY public Passport profile
async function lookupPassport(username: string) {
  const response = await fetch(
    `https://aethex.foundation/api/passport/${username}`
  );
  
  if (!response.ok) {
    throw new Error('User not found');
  }
  
  return response.json();
}

// Use case: Display collaborator profiles
const alice = await lookupPassport('alice');
console.log(alice.badge_count); // 12
console.log(alice.level); // 5
```

---

## 🎯 User Experience Flow

### **From Corp User's Perspective:**

1. **"I want to sign up for aethex.dev"**
   - Clicks "Sign Up"
   - Redirected to Foundation
   - Creates Passport (one time)
   - Returns to Corp logged in

2. **"I want to view my profile"**
   - Clicks "My Passport" in Corp nav
   - Opens Foundation profile
   - Sees achievements, badges, full profile

3. **"I want to share my profile"**
   - Shares: `https://aethex.foundation/alice`
   - Works on Twitter, Discord, anywhere
   - Full SEO/OpenGraph support

4. **"I want to view another user"**
   - Clicks on username anywhere in Corp
   - Opens their Foundation Passport
   - Can see their public info

---

## 🔐 Privacy & Permissions

### **Public Data** (Anyone can see via Passport):
- Username, full name, avatar
- Bio, location
- Social links (website, GitHub, Twitter, LinkedIn)
- Level, XP, badge count
- Join date

### **Private Data** (Only user + OAuth clients can see):
- Email address
- Detailed achievement list
- OAuth connections (Discord, GitHub, Google)
- Internal user ID

**Corp Receives via OAuth:**
- All public data
- Email address (with `email` scope)
- Achievements (with `achievements` scope)

---

## 🎨 Branding Consistency

### **Foundation Passport = Red/Gold**
```
🔴 Primary: #EF4444 (Red)
🟡 Accent: Gold (#FBBF24)
⚫ Background: Dark theme
```

### **Corp Can:**
- ✅ Link to Foundation Passports (recommended)
- ✅ Display Foundation data with attribution
- ✅ Use Foundation avatars/usernames
- ❌ Clone Passport UI (should direct to Foundation)

---

## 📈 Benefits for Corp

1. **No Auth Maintenance**
   - Foundation handles all signup/login
   - Foundation manages password resets
   - Foundation handles OAuth providers

2. **Unified Identity**
   - One username across all AeThex properties
   - Users don't create duplicate accounts
   - Achievements/reputation portable

3. **Rich Profile Data**
   - Instant access to level/XP/badges
   - Public Passport profiles for collaboration
   - Social verification built-in

4. **Governance Compliance**
   - Foundation can revoke Corp access (Axiom Model)
   - Foundation ensures ethical use
   - Users control their data centrally

---

## 🚀 Implementation Checklist for Corp

- [ ] Add Foundation OAuth (Phase 3 complete)
- [ ] Replace local auth with Foundation redirect
- [ ] Sync user data from `/api/oauth/userinfo`
- [ ] Display usernames as clickable links to Foundation
- [ ] Add "View Passport" button in user profiles
- [ ] Use Foundation avatars throughout Corp UI
- [ ] Test cross-domain linking
- [ ] Add referral tracking (`?ref=aethex_corp`)

---

## 🎉 Result

**One Identity Across the AeThex Ecosystem:**

```
Foundation Passport: alice
         ↓
    ┌────┴────┬────────┬────────┐
    │         │        │        │
aethex.dev  aethex.sbs  Future   More
  Corp      Services   Apps     Properties
```

**All apps recognize `@alice`, all use her Foundation Passport!**

---

**Generated:** November 17, 2025  
**Integration Guide for:** aethex.dev (Corp)  
**Foundation API:** https://aethex.foundation/api
