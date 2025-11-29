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
import DiscordVerify from "./pages/DiscordVerify";
import FourOhFourPage from "./pages/404";
import GameForge from "./pages/GameForge";
import GameForgeAbout from "./pages/gameforge/GameForgeAbout";
import GameForgeJoinGameForge from "./pages/gameforge/GameForgeJoinGameForge";
import GameForgePricing from "./pages/gameforge/GameForgePricing";
import GameForgeStartBuilding from "./pages/gameforge/GameForgeStartBuilding";
import GameForgeTeams from "./pages/gameforge/GameForgeTeams";
import GameForgeViewPortfolio from "./pages/gameforge/GameForgeViewPortfolio";

import Hub from "./pages/hub/Hub";
import Protocol from "./pages/hub/Protocol";
import Governance from "./pages/hub/Governance";
import CommunityHub from "./pages/hub/Community";
import HubPassport from "./pages/hub/Passport";

import Programs from "./pages/Programs";
import Achievements from "./pages/Achievements";
import Community from "./pages/Community";
import Trust from "./pages/Trust";
import Resources from "./pages/Resources";

import Admin from "./pages/Admin";
import OAuthClients from "./pages/OAuthClients";
import ProfileView from "./pages/ProfileView";
import ProfileEdit from "./pages/ProfileEdit";
import { Analytics } from "@vercel/analytics/react";
import { Web3Provider } from "./components/Web3Provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Analytics />
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
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/oauth-clients" element={<OAuthClients />} />

                  {/* Discord OAuth */}
                  <Route path="/discord-verify" element={<DiscordVerify />} />

                  {/* Legal */}
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />

                  {/* Legacy Redirects */}
                  <Route path="/foundation" element={<Navigate to="/about" replace />} />
                  <Route path="/foundation/curriculum" element={<Navigate to="/programs" replace />} />
                  <Route path="/foundation/achievements" element={<Navigate to="/achievements" replace />} />
                  <Route path="/foundation/downloads" element={<Navigate to="/resources" replace />} />
                  <Route path="/foundation/community" element={<Navigate to="/community" replace />} />
                  <Route path="/foundation/community/*" element={<Navigate to="/community" replace />} />
                  <Route path="/foundation/*" element={<Navigate to="/about" replace />} />
                  <Route path="/ethics-council" element={<Navigate to="/trust" replace />} />
                  <Route path="/curriculum" element={<Navigate to="/programs" replace />} />
                  <Route path="/downloads" element={<Navigate to="/resources" replace />} />
                  <Route path="/workshops" element={<Navigate to="/programs" replace />} />
                  <Route path="/creators" element={<Navigate to="/community" replace />} />
                  <Route path="/leaderboard" element={<Navigate to="/community" replace />} />
                  <Route path="/projects" element={<Navigate to="/hub/community" replace />} />

                  {/* Passport Profile (Wildcard - must be before 404) */}
                  <Route path="/:username" element={<Passport />} />

                  {/* 404 Not Found */}
                  <Route path="*" element={<FourOhFourPage />} />
                </Routes>
              </PageTransition>
            </ArmThemeProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;
