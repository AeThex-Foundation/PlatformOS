import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PageTransition from "./components/PageTransition";
import SkipAgentController from "./components/SkipAgentController";

import Index from "./pages/Index";
import About from "./pages/About";
import EthicsCouncil from "./pages/EthicsCouncil";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Passport from "./pages/Passport";
import FourOhFourPage from "./pages/404";

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
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Analytics />
        <BrowserRouter>
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
                    <Route path="/foundation/community/teams" element={<FoundationTeams />} />
                    <Route path="/foundation/community/about" element={<FoundationAbout />} />

                    {/* Shortcuts */}
                    <Route path="/curriculum" element={<Navigate to="/foundation/curriculum" replace />} />
                    <Route path="/achievements" element={<Navigate to="/foundation/achievements" replace />} />
                    <Route path="/downloads" element={<Navigate to="/foundation/downloads" replace />} />
                    <Route path="/projects" element={<Navigate to="/hub/community" replace />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Legal */}
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />

                    {/* Passport Profile (Wildcard - must be before 404) */}
                    <Route path="/:username" element={<Passport />} />

                    {/* 404 Not Found */}
                    <Route path="*" element={<FourOhFourPage />} />
                  </Routes>
          </PageTransition>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
