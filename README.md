# Guardian's Hub

**Official AeThex Foundation Website**

Guardian's Hub is the official digital home of the AeThex Foundation, featuring a public "Trust Billboard" and an authenticated "Hub" experience for community members.

---

## 🎯 Overview

Guardian's Hub serves two primary functions:

### **Trust Billboard** (Public Pages)
Accessible to everyone, showcasing the Foundation's mission and values:
- **Homepage** (`/`) - Foundation curriculum, open source initiatives, community highlights, and achievements
- **About** (`/about`) - Foundation mission statement and Axiom Model
- **Ethics Council** (`/ethics-council`) - Meet the Ethics Council members
- **Contact** (`/contact`) - Contact form for inquiries

### **Hub** (Authenticated Experience)
Exclusive content for logged-in community members:
- **Hub Dashboard** (`/hub`) - Community landing page
- **Protocol Docs** (`/hub/protocol`) - Technical protocol documentation and whitepaper
- **Governance** (`/hub/governance`) - DAO governance with Tally.xyz integration
- **Community** (`/hub/community`) - Bounty board and collaboration opportunities

---

## 🚀 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Routing:** React Router 6 (SPA)
- **Styling:** TailwindCSS 3 + Radix UI components
- **Backend:** Express.js server
- **Authentication:** Supabase
- **Email:** Nodemailer
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Charts:** Recharts

---

## 🎨 Design System

Guardian's Hub uses an exclusive **red and gold color scheme**:
- **Red Accent:** `#EF4444`
- **Gold Accent:** Complementary gold tones
- **Theme:** Dark mode optimized with elegant gradients and effects

---

## 📁 Project Structure

```
guardians-hub/
├── client/                  # React frontend
│   ├── pages/              # Route components
│   │   ├── Index.tsx       # Foundation homepage
│   │   ├── About.tsx       # About Foundation
│   │   ├── EthicsCouncil.tsx
│   │   ├── Contact.tsx
│   │   ├── hub/            # Hub pages (authenticated)
│   │   └── foundation/     # Foundation-specific pages
│   ├── components/         # Reusable UI components
│   │   └── ui/             # shadcn/ui component library
│   ├── contexts/           # React contexts (Auth, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   └── global.css          # Global styles & theme
├── server/                 # Express backend
│   ├── index.ts            # Main server (Foundation-only)
│   ├── supabase.ts         # Supabase admin client
│   └── email.ts            # Email service
├── api/                    # API endpoints
│   ├── blog/               # Foundation blog
│   └── foundation/         # Foundation APIs
├── shared/                 # Shared TypeScript types
├── supabase/               # Database migrations
└── public/                 # Static assets
```

---

## 🛠️ Development

### Prerequisites
- Node.js 20+
- npm or pnpm

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase (for authentication)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key

# Email Service
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
CONTACT_EMAIL=contact@aethex.dev

# Optional
PORT=5000
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`

### Build for Production

```bash
# Build client and server
npm run build

# Preview production build
npm run preview
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Type checking
npm run typecheck
```

---

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run test suite
- `npm run format` - Format code with Prettier
- `npm run typecheck` - TypeScript type checking

---

## 🌐 Deployment

Guardian's Hub is configured to run on Replit with the following settings:

- **Port:** 5000 (required for Replit webview)
- **Host:** 0.0.0.0 (allows iframe proxy access)
- **HMR:** Configured with WebSocket support

### Production Deployment

The site is production-ready and can be deployed to:
- **Replit** (current platform)
- **Vercel** (with Vite SSR)
- **Netlify** (static export)
- **Custom VPS** (with Node.js server)

---

## 🔒 Authentication

Guardian's Hub uses **Supabase Authentication** to gate the Hub section:

- Public pages are accessible to everyone
- Hub pages require authentication
- Email/password and OAuth providers supported
- Automatic profile creation on first login

---

## 🎯 Key Features

- ✅ **Foundation-Only Architecture** - Clean separation from main AeThex platform
- ✅ **Public Trust Billboard** - Transparent foundation information
- ✅ **Authenticated Hub** - Exclusive community content
- ✅ **Red & Gold Theme** - Distinctive Foundation branding
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **TypeScript Throughout** - Type-safe codebase
- ✅ **Hot Module Replacement** - Fast development experience
- ✅ **SEO Optimized** - Meta tags and structured data

---

## 📚 Documentation

- `replit.md` - Project documentation and architecture notes
- `MIGRATION_PLAN.md` - Repository separation plan

---

## 🤝 Contributing

Guardian's Hub is the official AeThex Foundation website. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

Proprietary - AeThex Foundation

---

## 🔗 Links

- **Repository:** https://github.com/AeThex-Corporation/aethex-foundation
- **Foundation Website:** https://aethex.dev
- **Supabase:** https://supabase.com

---

## 💬 Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Contact: contact@aethex.dev

---

**Built with ❤️ by the AeThex Foundation**
