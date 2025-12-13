import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ArmThemeProvider } from "./contexts/ArmThemeContext";
import PageTransition from "./components/PageTransition";
import SkipAgentController from "./components/SkipAgentController";
import PassportRouter from "./components/passport/PassportRouter";

import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Passport from "./pages/Passport";
import PassportHub from "./pages/PassportHub";
import DiscordVerify from "./pages/DiscordVerify";
import FourOhFourPage from "./pages/404";
import GameForge from "./pages/GameForge";
import GameForgeAbout from "./pages/gameforge/GameForgeAbout";
import GameForgeJoinGameForge from "./pages/gameforge/GameForgeJoinGameForge";
import GameForgePricing from "./pages/gameforge/GameForgePricing";
import GameForgeStartBuilding from "./pages/gameforge/GameForgeStartBuilding";
import GameForgeTeams from "./pages/gameforge/GameForgeTeams";
import GameForgeViewPortfolio from "./pages/gameforge/GameForgeViewPortfolio";
import GameForgeDashboard from "./pages/dashboards/GameForgeDashboard";

import Hub from "./pages/hub/Hub";
import Protocol from "./pages/hub/Protocol";
import Governance from "./pages/hub/Governance";
import CommunityHub from "./pages/hub/Community";
import HubPassport from "./pages/hub/Passport";

import EthosArtistSettings from "./pages/ethos/ArtistSettings";
import EthosTrackLibrary from "./pages/ethos/TrackLibrary";
import EthosGuild from "./pages/ethos/EthosGuild";
import EthosArtistProfile from "./pages/ethos/ArtistProfile";
import EthosLicensingDashboard from "./pages/ethos/LicensingDashboard";

import MenteeHub from "./pages/mentorship/MenteeHub";
import MentorApply from "./pages/mentorship/MentorApply";
import MentorProfile from "./pages/mentorship/MentorProfile";
import MentorshipPrograms from "./pages/mentorship/MentorshipPrograms";
import MentorshipRequest from "./pages/mentorship/MentorshipRequest";

import FoundationAchievements from "./pages/foundation/FoundationAchievements";
import FoundationContribute from "./pages/foundation/FoundationContribute";
import FoundationCurriculum from "./pages/foundation/FoundationCurriculum";
import FoundationDashboard from "./pages/foundation/FoundationDashboard";
import FoundationGetInvolved from "./pages/foundation/FoundationGetInvolved";
import FoundationLearnMore from "./pages/foundation/FoundationLearnMore";
import FoundationTeams from "./pages/foundation/FoundationTeams";

import OpportunitiesHub from "./pages/opportunities/OpportunitiesHub";
import OpportunityDetail from "./pages/opportunities/OpportunityDetail";
import OpportunityPostForm from "./pages/opportunities/OpportunityPostForm";
import MyApplications from "./pages/opportunities/MyApplications";

import StaffAnnouncements from "./pages/staff/StaffAnnouncements";
import StaffKnowledgeBase from "./pages/staff/StaffKnowledgeBase";
import StaffProjectTracking from "./pages/staff/StaffProjectTracking";
import StaffTeamHandbook from "./pages/staff/StaffTeamHandbook";
import StaffExpenseReports from "./pages/staff/StaffExpenseReports";
import StaffLearningPortal from "./pages/staff/StaffLearningPortal";
import StaffPerformanceReviews from "./pages/staff/StaffPerformanceReviews";
import StaffInternalMarketplace from "./pages/staff/StaffInternalMarketplace";

import Blog from "./pages/content/Blog";
import BlogPost from "./pages/content/BlogPost";
import Feed from "./pages/content/Feed";
import Changelog from "./pages/content/Changelog";
import Status from "./pages/content/Status";
import Tutorials from "./pages/content/Tutorials";

import Programs from "./pages/Programs";
import Achievements from "./pages/Achievements";
import Community from "./pages/Community";
import Trust from "./pages/Trust";
import Resources from "./pages/Resources";
import Downloads from "./pages/Downloads";

import Admin from "./pages/Admin";
import OAuthClients from "./pages/OAuthClients";
import ProfileView from "./pages/ProfileView";
import ProfileEdit from "./pages/ProfileEdit";
import { Analytics } from "@vercel/analytics/react";
import { Web3Provider } from "./components/Web3Provider";

import Teams from "./pages/Teams";
import Nexus from "./pages/Nexus";
import Support from "./pages/Support";

import TLDHome from "./pages/tld/TLDHome";
import TLDDashboard from "./pages/tld/TLDDashboard";
import AgoraPage from "./pages/tld/AgoraPage";
import GrantsPage from "./pages/tld/GrantsPage";

import CreatorDirectory from "./pages/creators/CreatorDirectory";
import CreatorProfile from "./pages/creators/CreatorProfile";

import DocsOverview from "./pages/docs/DocsOverview";
import DocsGettingStarted from "./pages/docs/DocsGettingStarted";
import DocsTutorials from "./pages/docs/DocsTutorials";
import DocsApiReference from "./pages/docs/DocsApiReference";
import DocsCli from "./pages/docs/DocsCli";
import DocsCurriculum from "./pages/docs/DocsCurriculum";
import DocsCurriculumEthos from "./pages/docs/DocsCurriculumEthos";
import DocsExamples from "./pages/docs/DocsExamples";
import DocsIntegrations from "./pages/docs/DocsIntegrations";
import DocsPlatform from "./pages/docs/DocsPlatform";
import DocsPartnerProposal from "./pages/docs/DocsPartnerProposal";
import DocsEditorsGuide from "./pages/docs/DocsEditorsGuide";
import Donate from "./pages/Donate";
import LegalDisclaimer from "./pages/LegalDisclaimer";

const queryClient = new QueryClient();

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
            <Route path="/gameforge/dashboard" element={<GameForgeDashboard />} />
            
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

            {/* Opportunities */}
            <Route path="/opportunities" element={<OpportunitiesHub />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail />} />
            <Route path="/opportunities/post" element={<OpportunityPostForm />} />
            <Route path="/my-applications" element={<MyApplications />} />

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
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;
