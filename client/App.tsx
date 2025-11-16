import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Web3Provider } from "./contexts/Web3Context";
import { DocsThemeProvider } from "./contexts/DocsThemeContext";
import PageTransition from "./components/PageTransition";
import SkipAgentController from "./components/SkipAgentController";

import Index from "./pages/Index";
import About from "./pages/About";
import EthicsCouncil from "./pages/EthicsCouncil";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FourOhFourPage from "./pages/404";
import ResetPassword from "./pages/ResetPassword";
import SignupRedirect from "./pages/SignupRedirect";

import Hub from "./pages/hub/Hub";
import Protocol from "./pages/hub/Protocol";
import Governance from "./pages/hub/Governance";
import CommunityHub from "./pages/hub/Community";

import Foundation from "./pages/Foundation";
import FoundationTeams from "./pages/foundation/FoundationTeams";
import FoundationAbout from "./pages/foundation/FoundationAbout";
import FoundationContribute from "./pages/foundation/FoundationContribute";
import FoundationLearnMore from "./pages/foundation/FoundationLearnMore";
import FoundationGetInvolved from "./pages/foundation/FoundationGetInvolved";
import FoundationCurriculum from "./pages/foundation/FoundationCurriculum";
import FoundationAchievements from "./pages/foundation/FoundationAchievements";
import FoundationDownloadCenter from "./pages/FoundationDownloadCenter";

import DevelopersDirectory from "./pages/DevelopersDirectory";
import ProfilePassport from "./pages/ProfilePassport";
import SubdomainPassport from "./pages/SubdomainPassport";
import Profile from "./pages/Profile";
import LegacyPassportRedirect from "./pages/LegacyPassportRedirect";

import Community from "./pages/Community";
import MentorshipRequest from "./pages/community/MentorshipRequest";
import MentorApply from "./pages/community/MentorApply";
import MentorProfile from "./pages/community/MentorProfile";
import EthosGuild from "./pages/community/EthosGuild";

import MyApplications from "./pages/profile/MyApplications";

import DocsLayout from "@/components/docs/DocsLayout";
import DocsOverview from "./pages/docs/DocsOverview";
import DocsTutorials from "./pages/docs/DocsTutorials";
import DocsGettingStarted from "./pages/docs/DocsGettingStarted";
import DocsPlatform from "./pages/docs/DocsPlatform";
import DocsApiReference from "./pages/docs/DocsApiReference";
import DocsCli from "./pages/docs/DocsCli";
import DocsExamples from "./pages/docs/DocsExamples";
import DocsIntegrations from "./pages/docs/DocsIntegrations";
import DocsCurriculum from "./pages/docs/DocsCurriculum";

import Space1Welcome from "./pages/internal-docs/Space1Welcome";
import Space1AxiomModel from "./pages/internal-docs/Space1AxiomModel";
import Space1FindYourRole from "./pages/internal-docs/Space1FindYourRole";
import Space2CodeOfConduct from "./pages/internal-docs/Space2CodeOfConduct";
import Space2Communication from "./pages/internal-docs/Space2Communication";
import Space2MeetingCadence from "./pages/internal-docs/Space2MeetingCadence";
import Space2BrandVoice from "./pages/internal-docs/Space2BrandVoice";
import Space2TechStack from "./pages/internal-docs/Space2TechStack";
import Space3FoundationGovernance from "./pages/internal-docs/Space3FoundationGovernance";
import Space3OpenSourceProtocol from "./pages/internal-docs/Space3OpenSourceProtocol";
import Space3CommunityPrograms from "./pages/internal-docs/Space3CommunityPrograms";
import Space4ProductOps from "./pages/internal-docs/Space4ProductOps";
import Space5Onboarding from "./pages/internal-docs/Space5Onboarding";
import Space5Finance from "./pages/internal-docs/Space5Finance";

import { SubdomainPassportProvider } from "./contexts/SubdomainPassportContext";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Web3Provider>
        <TooltipProvider>
          <Toaster />
          <Analytics />
          <BrowserRouter>
            <SubdomainPassportProvider>
              <SkipAgentController />
              <PageTransition>
                <Routes>
                    {/* Foundation Homepage */}
                    <Route path="/" element={<Index />} />

                    {/* Public Foundation Pages */}
                    <Route path="/about" element={<About />} />
                    <Route path="/ethics-council" element={<EthicsCouncil />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Hub (Logged-in Community Experience) */}
                    <Route path="/hub" element={<Hub />} />
                    <Route path="/hub/protocol" element={<Protocol />} />
                    <Route path="/hub/governance" element={<Governance />} />
                    <Route path="/hub/community" element={<CommunityHub />} />

                    {/* Foundation Pages */}
                    <Route path="/foundation" element={<Foundation />} />
                    <Route path="/foundation/curriculum" element={<FoundationCurriculum />} />
                    <Route path="/foundation/achievements" element={<FoundationAchievements />} />
                    <Route path="/foundation/contribute" element={<FoundationContribute />} />
                    <Route path="/foundation/learn-more" element={<FoundationLearnMore />} />
                    <Route path="/foundation/get-involved" element={<FoundationGetInvolved />} />
                    <Route path="/foundation/downloads" element={<FoundationDownloadCenter />} />

                    {/* Foundation Community */}
                    <Route path="/foundation/community" element={<Community />} />
                    <Route path="/foundation/community/developers" element={<DevelopersDirectory />} />
                    <Route path="/foundation/community/teams" element={<FoundationTeams />} />
                    <Route path="/foundation/community/about" element={<FoundationAbout />} />
                    <Route path="/foundation/community/mentorship" element={<MentorshipRequest />} />
                    <Route path="/foundation/community/mentorship/apply" element={<MentorApply />} />
                    <Route path="/foundation/community/mentor/:username" element={<MentorProfile />} />
                    <Route path="/foundation/community/groups/ethos" element={<EthosGuild />} />

                    {/* Shortcuts */}
                    <Route path="/curriculum" element={<Navigate to="/foundation/curriculum" replace />} />
                    <Route path="/achievements" element={<Navigate to="/foundation/achievements" replace />} />
                    <Route path="/downloads" element={<Navigate to="/foundation/downloads" replace />} />
                    <Route path="/community" element={<Navigate to="/foundation/community" replace />} />
                    <Route path="/projects" element={<Navigate to="/hub/community" replace />} />

                    {/* Profile System */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/me" element={<Profile />} />
                    <Route path="/profile/applications" element={<MyApplications />} />
                    <Route path="/passport" element={<Navigate to="/passport/me" replace />} />
                    <Route path="/passport/me" element={<ProfilePassport />} />
                    <Route path="/passport/:username" element={<ProfilePassport />} />
                    <Route path="/profiles/me" element={<LegacyPassportRedirect />} />
                    <Route path="/profiles/:id" element={<LegacyPassportRedirect />} />

                    {/* Legacy Redirects */}
                    <Route path="/developers" element={<Navigate to="/foundation/community/developers" replace />} />
                    <Route path="/developers/me" element={<Navigate to="/foundation/community/developers" replace />} />
                    <Route path="/developers/:id" element={<Navigate to="/foundation/community/developers" replace />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignupRedirect />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Documentation */}
                    <Route
                      path="/docs"
                      element={
                        <DocsThemeProvider>
                          <DocsLayout />
                        </DocsThemeProvider>
                      }
                    >
                      <Route index element={<DocsOverview />} />
                      <Route path="tutorials" element={<DocsTutorials />} />
                      <Route path="curriculum" element={<DocsCurriculum />} />
                      <Route path="getting-started" element={<DocsGettingStarted />} />
                      <Route path="platform" element={<DocsPlatform />} />
                      <Route path="api" element={<DocsApiReference />} />
                      <Route path="cli" element={<DocsCli />} />
                      <Route path="examples" element={<DocsExamples />} />
                      <Route path="integrations" element={<DocsIntegrations />} />
                    </Route>

                    {/* Foundation Internal Docs */}
                    <Route path="/internal-docs/foundation-governance" element={<Space3FoundationGovernance />} />
                    <Route path="/internal-docs/open-source-protocol" element={<Space3OpenSourceProtocol />} />
                    <Route path="/internal-docs/community-programs" element={<Space3CommunityPrograms />} />
                    <Route path="/internal-docs/welcome" element={<Space1Welcome />} />
                    <Route path="/internal-docs/axiom-model" element={<Space1AxiomModel />} />
                    <Route path="/internal-docs/find-your-role" element={<Space1FindYourRole />} />
                    <Route path="/internal-docs/code-of-conduct" element={<Space2CodeOfConduct />} />
                    <Route path="/internal-docs/communication" element={<Space2Communication />} />
                    <Route path="/internal-docs/meeting-cadence" element={<Space2MeetingCadence />} />
                    <Route path="/internal-docs/brand-voice" element={<Space2BrandVoice />} />
                    <Route path="/internal-docs/tech-stack" element={<Space2TechStack />} />
                    <Route path="/internal-docs/product-ops" element={<Space4ProductOps />} />
                    <Route path="/internal-docs/onboarding" element={<Space5Onboarding />} />
                    <Route path="/internal-docs/finance" element={<Space5Finance />} />

                    {/* Legal */}
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />

                    {/* 404 Not Found */}
                    <Route path="*" element={<FourOhFourPage />} />
                  </Routes>
                </PageTransition>
            </SubdomainPassportProvider>
          </BrowserRouter>
        </TooltipProvider>
      </Web3Provider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
