import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Gamepad2, ArrowRight, Shield, Sparkles, ExternalLink, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoLandingProps {
  onSelectMode: (mode: "creator" | "project") => void;
}

export default function DemoLanding({ onSelectMode }: DemoLandingProps) {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      isDark ? "bg-gradient-to-br from-slate-950 via-background to-slate-950" : "bg-gradient-to-br from-slate-100 via-white to-slate-100"
    )}>
      <header className={cn(
        "flex items-center justify-between p-4 border-b",
        isDark ? "border-border/50 bg-slate-950/80 backdrop-blur-sm" : "border-slate-300 bg-white shadow-sm"
      )}>
        <a 
          href="https://aethex.foundation" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className={cn("font-bold text-lg", isDark ? "text-white" : "text-slate-900")}>
            Passport Engine
          </span>
        </a>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            className={cn(
              "transition-colors",
              isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
            )}
            data-testid="button-theme-toggle"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(
              "transition-colors",
              isDark ? "border-slate-700 text-slate-300 hover:text-white" : "border-slate-300 text-slate-600 hover:text-slate-900"
            )}
          >
            <a href="https://aethex.foundation" target="_blank" rel="noreferrer">
              Foundation
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 pt-16">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AeThex Passport System</span>
            </div>
            <h1 className={cn(
              "text-4xl md:text-5xl font-bold mb-4",
              isDark ? "text-white" : "text-slate-900"
            )}>
              Multi-Tenant Identity Engine
            </h1>
            <p className={cn(
              "text-lg max-w-2xl mx-auto",
              isDark ? "text-slate-400" : "text-slate-600"
            )}>
              Preview creator profiles and project showcases. In production, traffic routes automatically based on subdomain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className={cn(
                "hover-elevate cursor-pointer group transition-colors",
                isDark 
                  ? "border-slate-800 bg-slate-900/70 hover:border-purple-500/50" 
                  : "border-slate-200 bg-white hover:border-purple-400/50 shadow-sm"
              )}
              onClick={() => onSelectMode("creator")}
              data-testid="card-select-creator"
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2 group-hover:bg-purple-500/30 transition-colors">
                  <User className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle className={cn("text-2xl", isDark ? "text-white" : "text-slate-900")}>
                  Creator Profile
                </CardTitle>
                <CardDescription className={isDark ? "text-slate-400" : "text-slate-500"}>
                  <code className="text-purple-500">username</code>.aethex.me
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={cn("mb-4", isDark ? "text-slate-400" : "text-slate-600")}>
                  Personal passport profiles with verified status, achievement badges, realm alignment, and social links.
                </p>
                <div className="flex items-center gap-2 text-purple-500 font-medium group-hover:gap-3 transition-all">
                  <span>Night Mode Theme</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={cn(
                "hover-elevate cursor-pointer group transition-colors",
                isDark 
                  ? "border-slate-800 bg-slate-900/70 hover:border-green-500/50" 
                  : "border-slate-200 bg-white hover:border-green-400/50 shadow-sm"
              )}
              onClick={() => onSelectMode("project")}
              data-testid="card-select-project"
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-2 group-hover:bg-green-500/30 transition-colors">
                  <Gamepad2 className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle className={cn("text-2xl", isDark ? "text-white" : "text-slate-900")}>
                  Project Showcase
                </CardTitle>
                <CardDescription className={isDark ? "text-slate-400" : "text-slate-500"}>
                  <code className="text-green-500">project-name</code>.aethex.space
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={cn("mb-4", isDark ? "text-slate-400" : "text-slate-600")}>
                  Game and project pages with hero images, team rosters, feature lists, and play links.
                </p>
                <div className="flex items-center gap-2 text-green-500 font-medium group-hover:gap-3 transition-all">
                  <span>GameForge Theme</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className={cn(
            "mt-12 p-6 rounded-xl border",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"
          )}>
            <h3 className={cn("text-sm font-semibold mb-3", isDark ? "text-white" : "text-slate-900")}>
              DNS Configuration
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <code className="px-3 py-1.5 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
                  *.aethex.me
                </code>
                <span className={isDark ? "text-slate-500" : "text-slate-600"}>CNAME to deployment</span>
              </div>
              <div className="flex items-center gap-3">
                <code className="px-3 py-1.5 rounded bg-green-500/10 text-green-500 border border-green-500/20">
                  *.aethex.space
                </code>
                <span className={isDark ? "text-slate-500" : "text-slate-600"}>CNAME to deployment</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className={cn("text-sm", isDark ? "text-slate-500" : "text-slate-600")}>
              Powered by <a href="https://aethex.foundation" className="text-amber-500 hover:text-amber-400 transition-colors">AeThex Foundation</a> Passport System
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
