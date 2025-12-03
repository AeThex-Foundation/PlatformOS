# AeThex Passport Engine - Design Guidelines

## Design Approach

**Dual-Theme System**: This project requires two distinct visual identities that serve different purposes while maintaining brand cohesion under the AeThex umbrella.

### Theme A: Night Mode (Creator Profiles - `.me`)
Reference aesthetic: Dark, neon-accented professional portfolios (similar to Dribbble dark mode, Behance pro profiles)
Purpose: Showcase individual creators with verified authority and professional credibility

### Theme B: GameForge (Project Showcases - `.space`)
Reference aesthetic: Retro gaming, pixel art-inspired project pages (similar to itch.io, indie game showcases)
Purpose: Present game projects with playful energy and team collaboration emphasis

---

## Typography System

### Creator Profiles (.me)
- **Headlines**: Modern sans-serif, bold weight (700-900) for names and sections
- **Body**: Clean sans-serif, regular weight (400) for descriptions
- **Badges/Tags**: Uppercase, medium weight (500-600), tracking-wide
- **Hierarchy**: 
  - Name: text-4xl to text-6xl
  - Section headers: text-2xl to text-3xl
  - Body text: text-base to text-lg
  - Badge labels: text-xs to text-sm

### Project Showcases (.space)
- **Headlines**: Pixel/monospace-inspired font or bold geometric sans-serif
- **Game Title**: Extra bold (800-900), text-5xl to text-7xl
- **Body**: Readable sans-serif for descriptions
- **Team names**: Medium weight (500-600)
- **Hierarchy**:
  - Game title: text-5xl to text-7xl
  - Section headers: text-3xl to text-4xl
  - Team roster: text-lg to text-xl
  - Metadata: text-sm

---

## Layout & Spacing System

**Spacing Units**: Use Tailwind spacing of 4, 6, 8, 12, 16, 24 for consistency
- Component padding: p-6, p-8, p-12
- Section spacing: space-y-12, space-y-16, space-y-24
- Grid gaps: gap-6, gap-8

### Creator Profile Layout (.me)

**Single-column centered layout** with max-w-4xl container:

1. **Hero Section** (h-screen or min-h-[80vh]):
   - Centered content with vertical centering
   - Avatar: Large circular image (w-32 h-32 to w-48 h-48)
   - Name directly below avatar (mb-2)
   - Verified checkmark inline with name
   - Tagline/role below name (mb-8)
   - Primary CTA: "Hire Me" button (prominent, px-8 py-3)

2. **Badges Section** (py-16):
   - Grid layout: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
   - Badge cards: Compact, icon + label format
   - Each badge: p-4, rounded corners, subtle border
   - Icons: w-8 h-8 to w-12 h-12

3. **Bio/About Section** (py-12):
   - Max-width prose for readability (max-w-2xl mx-auto)
   - Generous line-height (leading-relaxed)

4. **Links Section** (py-12):
   - Vertical stack of link cards (space-y-4)
   - Each link: p-6, with icon left, arrow right

### Project Showcase Layout (.space)

**Full-width sections** with varied content containers:

1. **Hero Section** (min-h-screen):
   - Full-width background (game hero image or graphic)
   - Centered content overlay
   - Game title: Massive, bold typography
   - Subtitle/tagline below (mb-8)
   - "Play Now" CTA: Large button (px-12 py-4) with blurred background (backdrop-blur-md bg-opacity-90)
   - Quick stats row: flex justify-center gap-8 (players, rating, genre tags)

2. **About Section** (py-20):
   - Container: max-w-6xl mx-auto
   - Two-column layout: lg:grid-cols-2
   - Left: Game description (prose format)
   - Right: Key features list or screenshot gallery

3. **Team Roster Section** (py-16):
   - Grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
   - Team member cards: Avatar (w-24 h-24), name, role
   - Each card links to their .me profile
   - Cards: p-6, text-center, hover lift effect

4. **Scope Anchor Section** (py-12):
   - Contained box: max-w-3xl mx-auto, p-8
   - Bordered/outlined container
   - Key project details: genre, platform, status, timeline

---

## Component Library

### Buttons

**Creator Profile Style**:
- Rounded: rounded-lg to rounded-full
- Padding: px-6 py-3 to px-8 py-4
- Font weight: font-semibold
- Border width: border-2 for outlined variants

**Project Showcase Style**:
- Squared or slightly rounded: rounded-md
- Padding: px-8 py-4 (larger for primary)
- Font weight: font-bold
- Shadow effects for depth

### Cards

**Badge Cards (.me)**:
- Compact, square or slightly rectangular
- Centered content
- Icon above label
- Padding: p-4 to p-6
- Border: border or border-2

**Team Member Cards (.space)**:
- Avatar-focused
- Circular avatar at top
- Name and role stacked below
- Padding: p-6
- Hover state: slight transform and shadow increase

### Verified Checkmark (.me)
- Inline SVG icon
- Size: w-6 h-6 to w-8 h-8
- Positioned: inline-block align-middle
- Margin: ml-2

### Link Cards (.me)
- Full-width containers
- Flex layout: justify-between items-center
- Icon left (w-6 h-6), text center-left, arrow right
- Padding: p-6
- Rounded: rounded-lg
- Border or subtle background

---

## Images

### Creator Profile (.me)
- **Avatar**: High-quality profile photo, circular crop, prominent placement in hero
- **Background (optional)**: Subtle pattern or gradient, not competing with content

### Project Showcase (.space)
- **Hero Image**: Full-width game screenshot or artwork, high visual impact (min-h-screen)
- **Screenshot Gallery**: Grid of 2-4 in-game images in About section
- **Team Avatars**: Circular profile photos for each team member

---

## Navigation

### Creator Profile (.me)
- Minimal or no navigation (profile is single-page)
- Sticky "Back to AeThex" link in top corner (fixed top-4 left-4)
- Social links row at bottom

### Project Showcase (.space)
- Simple horizontal nav if multi-section
- Sticky header with game logo/title
- CTA button persistent in header

---

## Accessibility & Performance

- All interactive elements: min-height of 44px
- Focus states: Clear, high-contrast outline (ring-2 ring-offset-2)
- Alt text for all images
- Semantic HTML structure (header, main, section, article)
- Fast-loading templates with minimal JavaScript
- Lazy loading for images below fold

---

## Responsive Behavior

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Badge grids: 2 cols → 3 cols → 4 cols
- Team rosters: 1 col → 2 cols → 3 cols → 4 cols
- Hero text sizes: Scale down 2 sizes on mobile
- Padding: Reduce by 50% on mobile (p-12 → p-6)