import "./global.css";

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ArmThemeProvider } from "./contexts/ArmThemeContext";
import PageTransition from "./components/PageTransition";
import SkipAgentController from "./components/SkipAgentController";
import PassportRouter from "./components/passport/PassportRouter";
import PWAInstaller from "./components/PWAInstaller";
import LoadingScreen from "./components/LoadingScreen";

// Critical path - load immediately
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FourOhFourPage from "./pages/404";

// Lazy loaded pages - loaded on demand
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));
const Profile = lazy(() => import("./pages/Profile"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Passport = lazy(() => import("./pages/Passport"));
const PassportHub = lazy(() => import("./pages/PassportHub"));
const DiscordVerify = lazy(() => import("./pages/DiscordVerify"));
const GameForge = lazy(() => import("./pages/GameForge"));
const GameForgeAbout = lazy(() => import("./pages/gameforge/GameForgeAbout"));
const GameForgeJoinGameForge = lazy(() => import("./pages/gameforge/GameForgeJoinGameForge"));
const GameForgePricing = lazy(() => import("./pages/gameforge/GameForgePricing"));
const GameForgeStartBuilding = lazy(() => import("./pages/gameforge/GameForgeStartBuilding"));
const GameForgeTeams = lazy(() => import("./pages/gameforge/GameForgeTeams"));
const GameForgeViewPortfolio = lazy(() => import("./pages/gameforge/GameForgeViewPortfolio"));
const GameForgeShowcase = lazy(() => import("./pages/gameforge/GameForgeShowcase"));
const GameForgePipeline = lazy(() => import("./pages/gameforge/GameForgePipeline"));

const Hub = lazy(() => import("./pages/hub/Hub"));
const Protocol = lazy(() => import("./pages/hub/Protocol"));
const Governance = lazy(() => import("./pages/hub/Governance"));
const CommunityHub = lazy(() => import("./pages/hub/Community"));
const HubPassport = lazy(() => import("./pages/hub/Passport"));

const EthosArtistSettings = lazy(() => import("./pages/ethos/ArtistSettings"));
const EthosTrackLibrary = lazy(() => import("./pages/ethos/TrackLibrary"));
const EthosGuild = lazy(() => import("./pages/ethos/EthosGuild"));
const EthosArtistProfile = lazy(() => import("./pages/ethos/ArtistProfile"));
const EthosLicensingDashboard = lazy(() => import("./pages/ethos/LicensingDashboard"));

const MenteeHub = lazy(() => import("./pages/mentorship/MenteeHub"));
const MentorApply = lazy(() => import("./pages/mentorship/MentorApply"));
const MentorProfile = lazy(() => import("./pages/mentorship/MentorProfile"));
const MentorshipPrograms = lazy(() => import("./pages/mentorship/MentorshipPrograms"));
const MentorshipRequest = lazy(() => import("./pages/mentorship/MentorshipRequest"));

const FoundationAchievements = lazy(() => import("./pages/foundation/FoundationAchievements"));
const FoundationContribute = lazy(() => import("./pages/foundation/FoundationContribute"));
const FoundationCurriculum = lazy(() => import("./pages/foundation/FoundationCurriculum"));
const FoundationDashboard = lazy(() => import("./pages/foundation/FoundationDashboard"));
const FoundationGetInvolved = lazy(() => import("./pages/foundation/FoundationGetInvolved"));
const FoundationLearnMore = lazy(() => import("./pages/foundation/FoundationLearnMore"));
const FoundationTeams = lazy(() => import("./pages/foundation/FoundationTeams"));

const OpportunitiesHub = lazy(() => import("./pages/opportunities/OpportunitiesHub"));
const OpportunityDetail = lazy(() => import("./pages/opportunities/OpportunityDetail"));
const OpportunityPostForm = lazy(() => import("./pages/opportunities/OpportunityPostForm"));
const MyApplications = lazy(() => import("./pages/opportunities/MyApplications"));

const StaffAnnouncements = lazy(() => import("./pages/staff/StaffAnnouncements"));
const StaffKnowledgeBase = lazy(() => import("./pages/staff/StaffKnowledgeBase"));
const StaffProjectTracking = lazy(() => import("./pages/staff/StaffProjectTracking"));
const StaffTeamHandbook = lazy(() => import("./pages/staff/StaffTeamHandbook"));
const StaffExpenseReports = lazy(() => import("./pages/staff/StaffExpenseReports"));
const StaffLearningPortal = lazy(() => import("./pages/staff/StaffLearningPortal"));
const StaffPerformanceReviews = lazy(() => import("./pages/staff/StaffPerformanceReviews"));
const StaffInternalMarketplace = lazy(() => import("./pages/staff/StaffInternalMarketplace"));

const Blog = lazy(() => import("./pages/content/Blog"));
const BlogPost = lazy(() => import("./pages/content/BlogPost"));
const Feed = lazy(() => import("./pages/content/Feed"));
const Changelog = lazy(() => import("./pages/content/Changelog"));
const Status = lazy(() => import("./pages/content/Status"));
const Tutorials = lazy(() => import("./pages/content/Tutorials"));

const Programs = lazy(() => import("./pages/Programs"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Community = lazy(() => import("./pages/Community"));
const Trust = lazy(() => import("./pages/Trust"));
const Resources = lazy(() => import("./pages/Resources"));
const Downloads = lazy(() => import("./pages/Downloads"));

const Admin = lazy(() => import("./pages/Admin"));
const OAuthClients = lazy(() => import("./pages/OAuthClients"));
const ProfileView = lazy(() => import("./pages/ProfileView"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
import { Analytics } from "@vercel/analytics/react";
import { Web3Provider } from "./components/Web3Provider";

const Teams = lazy(() => import("./pages/Teams"));
const Nexus = lazy(() => import("./pages/Nexus"));
const Support = lazy(() => import("./pages/Support"));

const TLDHome = lazy(() => import("./pages/tld/TLDHome"));
const TLDDashboard = lazy(() => import("./pages/tld/TLDDashboard"));
const AgoraPage = lazy(() => import("./pages/tld/AgoraPage"));
const GrantsPage = lazy(() => import("./pages/tld/GrantsPage"));

const CreatorDirectory = lazy(() => import("./pages/creators/CreatorDirectory"));
const CreatorProfile = lazy(() => import("./pages/creators/CreatorProfile"));

const DocsOverview = lazy(() => import("./pages/docs/DocsOverview"));
const DocsGettingStarted = lazy(() => import("./pages/docs/DocsGettingStarted"));
const DocsTutorials = lazy(() => import("./pages/docs/DocsTutorials"));
const DocsApiReference = lazy(() => import("./pages/docs/DocsApiReference"));
const DocsCli = lazy(() => import("./pages/docs/DocsCli"));
const DocsCurriculum = lazy(() => import("./pages/docs/DocsCurriculum"));
const DocsCurriculumEthos = lazy(() => import("./pages/docs/DocsCurriculumEthos"));
const DocsExamples = lazy(() => import("./pages/docs/DocsExamples"));
const DocsIntegrations = lazy(() => import("./pages/docs/DocsIntegrations"));
const DocsPlatform = lazy(() => import("./pages/docs/DocsPlatform"));
const DocsPartnerProposal = lazy(() => import("./pages/docs/DocsPartnerProposal"));
const DocsEditorsGuide = lazy(() => import("./pages/docs/DocsEditorsGuide"));
const Donate = lazy(() => import("./pages/Donate"));
const LegalDisclaimer = lazy(() => import("./pages/LegalDisclaimer"));

const queryClient = new QueryClient();

function OpportunityIdRedirect() {
  const { id } = useParams();
  return <Navigate to={`/gig-radar/${id}`} replace />;
}


function isPassportSubdomain(): "creator" | "project" | false {
  const hostname = window.location.hostname;
  if (hostname.endsWith(".aethex.me")) {
    return "creator";
  }
  if (hostname.endsWith(".aethex.space")) {
    return "project";
  }
  return false;
}

function AppContent() {
  const passportType = isPassportSubdomain();
  if (passportType) {
    return <PassportRouter />;
  }
  return (
    <BrowserRouter>
      <ArmThemeProvider>
        <SkipAgentController />
        <PageTransition>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Homepage */}
              <Route path="/" element={<Index />} />

              {/* Public Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/community" element={<Community />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/trust" element={<Trust />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donate />} />

            {/* Hub (Authenticated Member Area) */}
            <Route path="/hub" element={<Hub />} />
            <Route path="/hub/protocol" element={<Protocol />} />
            <Route path="/hub/governance" element={<Governance />} />
            <Route path="/hub/community" element={<CommunityHub />} />
            <Route path="/hub/passport" element={<HubPassport />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/settings" element={<ProfileSettings />} />
            
            {/* Profile Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/me" element={<ProfileView />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/profile/:username" element={<ProfileView />} />
            
            {/* GameForge */}
            <Route path="/gameforge" element={<GameForge />} />
            <Route path="/gameforge/about" element={<GameForgeAbout />} />
            <Route path="/gameforge/join-gameforge" element={<GameForgeJoinGameForge />} />
            <Route path="/gameforge/pricing" element={<GameForgePricing />} />
            <Route path="/gameforge/start-building" element={<GameForgeStartBuilding />} />
            <Route path="/gameforge/teams" element={<GameForgeTeams />} />
            <Route path="/gameforge/view-portfolio" element={<GameForgeViewPortfolio />} />
            <Route path="/gameforge/showcase" element={<GameForgeShowcase />} />
            <Route path="/gameforge/pipeline" element={<GameForgePipeline />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/oauth-clients" element={<OAuthClients />} />

            {/* Discord OAuth */}
            <Route path="/discord-verify" element={<DiscordVerify />} />

            {/* Legal */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/legal/disclaimer" element={<LegalDisclaimer />} />

            {/* Foundation */}
            <Route path="/downloads" element={<Downloads />} />

            {/* Legacy Redirects */}
            <Route path="/foundation" element={<Navigate to="/about" replace />} />
            <Route path="/foundation/about" element={<Navigate to="/about" replace />} />
            <Route path="/foundation/downloads" element={<Navigate to="/downloads" replace />} />
            <Route path="/foundation/community" element={<Navigate to="/community" replace />} />
            <Route path="/foundation/community/*" element={<Navigate to="/community" replace />} />
            <Route path="/ethics-council" element={<Navigate to="/trust" replace />} />
            <Route path="/curriculum" element={<Navigate to="/programs" replace />} />
            <Route path="/workshops" element={<Navigate to="/programs" replace />} />
            <Route path="/leaderboard" element={<Navigate to="/community" replace />} />
            <Route path="/projects" element={<Navigate to="/hub/community" replace />} />

            {/* Ethos Guild */}
            <Route path="/ethos" element={<EthosGuild />} />
            <Route path="/ethos/settings" element={<EthosArtistSettings />} />
            <Route path="/ethos/library" element={<EthosTrackLibrary />} />
            <Route path="/ethos/artist/:id" element={<EthosArtistProfile />} />
            <Route path="/ethos/licensing" element={<EthosLicensingDashboard />} />

            {/* Mentorship */}
            <Route path="/mentorship" element={<MentorshipPrograms />} />
            <Route path="/mentorship/mentee" element={<MenteeHub />} />
            <Route path="/mentorship/apply" element={<MentorApply />} />
            <Route path="/mentorship/mentor/:id" element={<MentorProfile />} />
            <Route path="/mentorship/request" element={<MentorshipRequest />} />

            {/* Foundation Pages */}
            <Route path="/foundation/achievements" element={<FoundationAchievements />} />
            <Route path="/foundation/contribute" element={<FoundationContribute />} />
            <Route path="/foundation/curriculum" element={<FoundationCurriculum />} />
            <Route path="/foundation/dashboard" element={<FoundationDashboard />} />
            <Route path="/foundation/get-involved" element={<FoundationGetInvolved />} />
            <Route path="/foundation/learn-more" element={<FoundationLearnMore />} />
            <Route path="/foundation/teams" element={<FoundationTeams />} />

            {/* Gig Radar (formerly Opportunities) */}
            <Route path="/gig-radar" element={<OpportunitiesHub />} />
            <Route path="/gig-radar/:id" element={<OpportunityDetail />} />
            <Route path="/gig-radar/post" element={<OpportunityPostForm />} />
            <Route path="/my-applications" element={<MyApplications />} />
            
            {/* Redirects from old opportunities routes */}
            <Route path="/opportunities" element={<Navigate to="/gig-radar" replace />} />
            <Route path="/opportunities/post" element={<Navigate to="/gig-radar/post" replace />} />
            <Route path="/opportunities/:id" element={<OpportunityIdRedirect />} />

            {/* Staff */}
            <Route path="/staff/announcements" element={<StaffAnnouncements />} />
            <Route path="/staff/knowledge-base" element={<StaffKnowledgeBase />} />
            <Route path="/staff/project-tracking" element={<StaffProjectTracking />} />
            <Route path="/staff/handbook" element={<StaffTeamHandbook />} />
            <Route path="/staff/expenses" element={<StaffExpenseReports />} />
            <Route path="/staff/learning" element={<StaffLearningPortal />} />
            <Route path="/staff/reviews" element={<StaffPerformanceReviews />} />
            <Route path="/staff/marketplace" element={<StaffInternalMarketplace />} />

            {/* Content */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/status" element={<Status />} />
            <Route path="/tutorials" element={<Tutorials />} />

            {/* Teams, Nexus, Support */}
            <Route path="/teams" element={<Teams />} />
            <Route path="/nexus" element={<Nexus />} />
            <Route path="/support" element={<Support />} />

            {/* Creators */}
            <Route path="/creators" element={<CreatorDirectory />} />
            <Route path="/creators/:username" element={<CreatorProfile />} />

            {/* Documentation */}
            <Route path="/docs" element={<DocsOverview />} />
            <Route path="/docs/getting-started" element={<DocsGettingStarted />} />
            <Route path="/docs/tutorials" element={<DocsTutorials />} />
            <Route path="/docs/api" element={<DocsApiReference />} />
            <Route path="/docs/cli" element={<DocsCli />} />
            <Route path="/docs/curriculum" element={<DocsCurriculum />} />
            <Route path="/docs/curriculum/ethos" element={<DocsCurriculumEthos />} />
            <Route path="/docs/examples" element={<DocsExamples />} />
            <Route path="/docs/integrations" element={<DocsIntegrations />} />
            <Route path="/docs/platform" element={<DocsPlatform />} />
            <Route path="/docs/partner-proposal" element={<DocsPartnerProposal />} />
            <Route path="/docs/editors-guide" element={<DocsEditorsGuide />} />

            {/* TLD Hub - .aethex Domain System */}
            <Route path="/tld" element={<TLDHome />} />
            <Route path="/tld/dashboard" element={<TLDDashboard />} />
            <Route path="/agora" element={<AgoraPage />} />
            <Route path="/grants" element={<GrantsPage />} />

            {/* Passport Hub */}
            <Route path="/passport" element={<PassportHub />} />

            {/* Passport Profile (Wildcard - must be before 404) */}
            <Route path="/:username" element={<Passport />} />

            {/* 404 Not Found */}
            <Route path="*" element={<FourOhFourPage />} />
          </Routes>
          </Suspense>
        </PageTransition>
      </ArmThemeProvider>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Analytics />
          <PWAInstaller />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;
